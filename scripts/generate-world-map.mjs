#!/usr/bin/env node
/**
 * Generates the offline world map used by My World: one SVG path per
 * country, keyed by cca3, projected and simplified at build time so the app
 * only has to draw strings.
 *
 * Source: Natural Earth 1:50m (world-atlas), matched to data/countries.json
 * by ISO numeric code (ccn3).
 *
 * Usage: yarn map:generate
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {geoNaturalEarth1, geoPath, geoCentroid} from 'd3-geo';
import {feature, merge} from 'topojson-client';
import {presimplify, quantile, simplify} from 'topojson-simplify';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'src/components/WorldMap/worldMap.json');

const WIDTH = 1000;
// Coordinates are rounded to 1 decimal: 0.1 units is under a point even
// at the maximum zoom on a phone.
const PRECISION = 10;
// Fraction of the least significant points dropped by simplification.
const SIMPLIFY_QUANTILE = 0.35;
// Shapes smaller than this (in map units) are too small to see or tap,
// so they also get a dot.
const MIN_SHAPE_SIZE = 4;

// Natural Earth features without an ISO code.
const FEATURE_NAME_TO_CCA3 = {
  Kosovo: 'UNK',
  Somaliland: 'SOM',
  'N. Cyprus': 'CYP',
};

// Overseas regions Natural Earth includes in their parent's shape. Polygons
// whose centroid falls in a box ([minLon, minLat, maxLon, maxLat]) are moved
// to that region.
const SPLITS = {
  FRA: {
    GUF: [-55, 2, -51, 6.5],
    GLP: [-62, 15.8, -60.9, 16.6],
    MTQ: [-61.3, 14.3, -60.8, 15],
    REU: [55, -21.5, 56, -20.8],
    MYT: [44.9, -13.1, 45.4, -12.5],
  },
  NOR: {
    SJM: [-10, 70.5, 35, 82],
  },
  NLD: {
    BES: [-69, 11.5, -62.5, 18],
  },
  // "Indian Ocean Ter." in Natural Earth.
  IOT_AU: {
    CXR: [105, -11, 106, -10],
    CCK: [96, -12.5, 97.5, -11.5],
  },
};

const inBox = ([lon, lat], [minLon, minLat, maxLon, maxLat]) =>
  lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;

const round = value => Math.round(value * PRECISION) / PRECISION;

/** A d3 path context that writes compact, rounded, mostly relative SVG. */
const compactPathContext = () => {
  let d = '';
  let x = 0;
  let y = 0;
  const fmt = n => String(round(n)).replace(/^(-?)0\./, '$1.');
  const pair = (dx, dy) => {
    const b = fmt(dy);
    return `${fmt(dx)}${b.startsWith('-') ? '' : ','}${b}`;
  };
  return {
    moveTo(px, py) {
      const rx = round(px);
      const ry = round(py);
      d += `M${pair(rx, ry)}`;
      x = rx;
      y = ry;
    },
    lineTo(px, py) {
      const rx = round(px);
      const ry = round(py);
      if (rx === x && ry === y) {
        return;
      }
      d += `l${pair(rx - x, ry - y)}`;
      x = rx;
      y = ry;
    },
    closePath() {
      d += 'z';
    },
    arc() {},
    result() {
      return d;
    },
  };
};

const main = () => {
  const topology = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'),
      'utf8',
    ),
  );
  const {countries} = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data/countries.json'), 'utf8'),
  );
  const ccn3ToCca3 = new Map(
    countries.filter(c => c.ccn3).map(c => [c.ccn3, c.cca3]),
  );

  const simplified = simplify(
    presimplify(topology),
    quantile(presimplify(topology), SIMPLIFY_QUANTILE),
  );
  const object = simplified.objects.countries;

  // Group the topology's geometries by country, merging the parts that
  // belong together (e.g. Somaliland into Somalia) along shared borders.
  const groups = new Map();
  const neutral = [];
  for (const geometry of object.geometries) {
    const name = geometry.properties.name;
    const cca3 =
      name === 'Indian Ocean Ter.'
        ? 'IOT_AU'
        : FEATURE_NAME_TO_CCA3[name] ?? ccn3ToCca3.get(geometry.id);
    if (!cca3) {
      // Disputed areas (e.g. Siachen Glacier) are drawn but not tracked.
      neutral.push(geometry);
      continue;
    }
    groups.set(cca3, [...(groups.get(cca3) ?? []), geometry]);
  }

  const shapes = new Map();
  for (const [cca3, geometries] of groups) {
    shapes.set(cca3, merge(simplified, geometries));
  }

  for (const [parent, regions] of Object.entries(SPLITS)) {
    const shape = shapes.get(parent);
    if (!shape) {
      throw new Error(`No shape for ${parent} to split.`);
    }
    const kept = [];
    for (const polygon of shape.coordinates) {
      const centroid = geoCentroid({type: 'Polygon', coordinates: polygon});
      const region = Object.keys(regions).find(code =>
        inBox(centroid, regions[code]),
      );
      if (region) {
        const regionShape = shapes.get(region) ?? {
          type: 'MultiPolygon',
          coordinates: [],
        };
        regionShape.coordinates.push(polygon);
        shapes.set(region, regionShape);
      } else {
        kept.push(polygon);
      }
    }
    if (parent === 'IOT_AU') {
      shapes.delete(parent);
    } else {
      shape.coordinates = kept;
    }
  }

  const land = {
    type: 'FeatureCollection',
    features: feature(simplified, object).features,
  };
  const projection = geoNaturalEarth1().fitWidth(WIDTH, land);
  const height = Math.ceil(geoPath(projection).bounds(land)[1][1]);

  const toPath = geometry => {
    const context = compactPathContext();
    geoPath(projection, context)(geometry);
    return context.result();
  };

  const output = {
    width: WIDTH,
    height,
    shapes: [],
    neutral: neutral.map(g => toPath(feature(simplified, g))).join(''),
    points: {},
  };

  const byCca3 = new Map(countries.map(c => [c.cca3, c]));
  for (const [cca3, geometry] of [...shapes].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (!byCca3.has(cca3)) {
      throw new Error(`${cca3} is on the map but not in the dataset.`);
    }
    const d = toPath(geometry);
    if (!d) {
      continue;
    }
    output.shapes.push({id: cca3, d});

    const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(geometry);
    if (Math.max(x1 - x0, y1 - y0) < MIN_SHAPE_SIZE) {
      const [x, y] = projection(geoCentroid(geometry));
      output.points[cca3] = [round(x), round(y)];
    }
  }

  // Countries with no shape at all (tiny islands) are drawn as dots at
  // their coordinates.
  const drawn = new Set(output.shapes.map(shape => shape.id));
  const missing = [];
  for (const country of countries) {
    if (drawn.has(country.cca3)) {
      continue;
    }
    const [lat, lng] = country.latlng ?? [];
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      missing.push(country.cca3);
      continue;
    }
    const [x, y] = projection([lng, lat]);
    output.points[country.cca3] = [round(x), round(y)];
  }
  if (missing.length) {
    throw new Error(`No shape or coordinates for: ${missing.join(', ')}`);
  }

  fs.writeFileSync(OUTPUT, `${JSON.stringify(output)}\n`);
  const kb = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(
    `World map: ${output.shapes.length} shapes, ${
      Object.keys(output.points).length
    } dots, ${WIDTH}x${height}, ${kb} KB -> ${path.relative(ROOT, OUTPUT)}`,
  );
};

main();
