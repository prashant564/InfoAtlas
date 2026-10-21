#!/usr/bin/env node
/**
 * Generates the offline world map used by My World: one SVG path per
 * country, keyed by cca3, projected and simplified at build time so the app
 * only has to draw strings.
 *
 * Source: Natural Earth 1:10m Admin 0 countries, India point of view
 * (borders as recognised by the Government of India: all of Jammu &
 * Kashmir, Ladakh incl. Aksai Chin, and Arunachal Pradesh in India). It is
 * downloaded once into node_modules/.cache and matched to
 * data/countries.json by ISO code.
 *
 * Usage: yarn map:generate
 */
import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';
import {fileURLToPath} from 'url';
import {geoArea, geoNaturalEarth1, geoPath, geoCentroid} from 'd3-geo';
import shapefile from 'shapefile';
import {topology} from 'topojson-server';
import {feature, merge} from 'topojson-client';
import {presimplify, quantile, simplify} from 'topojson-simplify';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'src/components/WorldMap/worldMap.json');

const SOURCE_NAME = 'ne_10m_admin_0_countries_ind';
const SOURCE_URL = `https://naciscdn.org/naturalearth/10m/cultural/${SOURCE_NAME}.zip`;
const SOURCE_VERSION = '5.1.1';
const CACHE_DIR = path.join(ROOT, 'node_modules/.cache/natural-earth');

const WIDTH = 1000;
// Coordinates are rounded to 1 decimal: 0.1 units is under a point even
// at the maximum zoom on a phone.
const PRECISION = 10;
// Fraction of points kept by simplification (the 1:10m source is far more
// detailed than a phone map needs).
const SIMPLIFY_KEEP = 0.05;
// Islands smaller than this (in square map units) are dropped, unless they
// are a country's largest piece.
const MIN_POLYGON_AREA = 0.15;
// Shapes smaller than this (in map units) are too small to see or tap,
// so they also get a dot.
const MIN_SHAPE_SIZE = 4;

// Natural Earth features without a usable ISO code.
const FEATURE_NAME_TO_CCA3 = {
  'Guantanamo Bay USNB': 'CUB',
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
    BVT: [3, -54.7, 3.7, -54.2],
  },
  NLD: {
    BES: [-69, 11.5, -62.5, 18],
  },
  AUS: {
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

/** Downloads and unzips the source once; returns the .shp path. */
const ensureSource = () => {
  const shp = path.join(CACHE_DIR, `${SOURCE_NAME}.shp`);
  const versionFile = path.join(CACHE_DIR, `${SOURCE_NAME}.VERSION.txt`);
  if (!fs.existsSync(shp)) {
    fs.mkdirSync(CACHE_DIR, {recursive: true});
    const zip = path.join(CACHE_DIR, `${SOURCE_NAME}.zip`);
    console.log(`Downloading ${SOURCE_URL}`);
    execFileSync('curl', ['-fsSL', '-o', zip, SOURCE_URL]);
    execFileSync('unzip', ['-o', '-q', zip, '-d', CACHE_DIR]);
  }
  const version = fs.readFileSync(versionFile, 'utf8').trim();
  if (version !== SOURCE_VERSION) {
    throw new Error(
      `Expected Natural Earth ${SOURCE_VERSION}, got ${version}. Review the borders, then update SOURCE_VERSION.`,
    );
  }
  return shp;
};

const main = async () => {
  const shp = ensureSource();
  const source = await shapefile.read(shp, shp.replace(/\.shp$/, '.dbf'), {
    encoding: 'utf-8',
  });
  const {countries} = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data/countries.json'), 'utf8'),
  );
  const ccn3ToCca3 = new Map(
    countries.filter(c => c.ccn3).map(c => [c.ccn3, c.cca3]),
  );
  const datasetCodes = new Set(countries.map(c => c.cca3));

  // Tag each feature with its cca3 (null: disputed or unclaimed land that
  // is drawn but not tracked, e.g. Bir Tawil).
  const features = source.features.map(f => {
    const p = f.properties;
    const name = String(p.NAME).trim();
    const ccn3 = String(p.ISO_N3_EH).padStart(3, '0');
    const iso3 = String(p.ISO_A3_EH).trim();
    const code =
      FEATURE_NAME_TO_CCA3[name] ??
      ccn3ToCca3.get(ccn3) ??
      (datasetCodes.has(iso3) ? iso3 : null);
    return {...f, properties: {name, code}};
  });

  const topo = topology(
    {countries: {type: 'FeatureCollection', features}},
    1e5,
  );
  const presimplified = presimplify(topo);
  const simplified = simplify(
    presimplified,
    quantile(presimplified, SIMPLIFY_KEEP),
  );
  const object = simplified.objects.countries;

  // Group geometries by country and merge the parts that belong together
  // (e.g. Australia and its external territories) along shared borders.
  const groups = new Map();
  const neutral = [];
  for (const geometry of object.geometries) {
    const {code} = geometry.properties;
    if (!code) {
      neutral.push(geometry);
      continue;
    }
    groups.set(code, [...(groups.get(code) ?? []), geometry]);
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
    shape.coordinates = kept;
  }

  const land = {
    type: 'FeatureCollection',
    features: feature(simplified, object).features,
  };
  const projection = geoNaturalEarth1().fitWidth(WIDTH, land);
  const height = Math.ceil(geoPath(projection).bounds(land)[1][1]);
  const projectedArea = polygon =>
    geoPath(projection).area({type: 'Polygon', coordinates: polygon});

  // d3 reads a ring's winding to tell inside from outside; simplification
  // can flip a tiny ring, which would then cover the whole globe.
  const rewound = polygon =>
    geoArea({type: 'Polygon', coordinates: polygon}) > 2 * Math.PI
      ? polygon.map(ring => [...ring].reverse())
      : polygon;

  // Normalises to a MultiPolygon, fixes winding and drops specks of islands
  // nobody could see, keeping each country's largest piece so nothing
  // disappears entirely.
  const cleaned = geometry => {
    const polygons = (
      geometry.type === 'Polygon'
        ? [geometry.coordinates]
        : geometry.coordinates
    ).map(rewound);
    const areas = polygons.map(projectedArea);
    const largest = Math.max(...areas);
    return {
      type: 'MultiPolygon',
      coordinates: polygons.filter(
        (_, i) => areas[i] >= MIN_POLYGON_AREA || areas[i] === largest,
      ),
    };
  };

  const toPath = geometry => {
    const context = compactPathContext();
    geoPath(projection, context)(geometry);
    return context.result();
  };

  const output = {
    width: WIDTH,
    height,
    shapes: [],
    neutral: neutral
      .map(g => toPath(cleaned(feature(simplified, g).geometry)))
      .join(''),
    points: {},
  };

  const byCca3 = new Map(countries.map(c => [c.cca3, c]));
  for (const [cca3, shape] of [...shapes].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (!byCca3.has(cca3)) {
      throw new Error(`${cca3} is on the map but not in the dataset.`);
    }
    const geometry = cleaned(shape);
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

  // Countries with no shape of their own (tiny islands, and places India
  // does not recognise as separate, e.g. Kosovo) are drawn as dots at
  // their coordinates, so they can still be tracked.
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

main().catch(error => {
  console.error(error);
  process.exit(1);
});
