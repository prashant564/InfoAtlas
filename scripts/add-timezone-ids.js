#!/usr/bin/env node
/**
 * Adds IANA timezone ids (e.g. "Europe/London") to every country in
 * data/countries.json, so the app can show DST-correct local times.
 * The dataset's `timezones` field only has fixed UTC offsets.
 *
 * Usage:
 *   curl -sL -o /tmp/zone.tab https://raw.githubusercontent.com/eggert/tz/main/zone.tab
 *   node scripts/add-timezone-ids.js /tmp/zone.tab
 *   yarn data:release
 */
const fs = require('fs');
const path = require('path');

const DATASET_PATH = path.join(__dirname, '..', 'data', 'countries.json');

// Countries zone.tab does not list but that share another country's zone.
const OVERRIDES = {
  XK: ['Europe/Belgrade'], // Kosovo
};

const zoneTabPath = process.argv[2];
if (!zoneTabPath) {
  console.error('Usage: node scripts/add-timezone-ids.js <path to zone.tab>');
  process.exit(1);
}

const zonesByCountry = {};
fs.readFileSync(zoneTabPath, 'utf8')
  .split('\n')
  .filter(line => line.trim() !== '' && !line.startsWith('#'))
  .forEach(line => {
    const [countryCode, , zone] = line.split('\t');
    zonesByCountry[countryCode] = [
      ...(zonesByCountry[countryCode] ?? []),
      zone,
    ];
  });

const dataset = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
const missing = [];

dataset.countries = dataset.countries.map(country => {
  const zones = OVERRIDES[country.cca2] ?? zonesByCountry[country.cca2];
  if (!zones) {
    missing.push(country.name.common);
    const {timezoneIds, ...rest} = country;
    return rest;
  }
  return {...country, timezoneIds: zones};
});

fs.writeFileSync(DATASET_PATH, JSON.stringify(dataset, null, 2) + '\n');

console.log(
  `Added timezone ids to ${
    dataset.countries.length - missing.length
  } countries.`,
);
if (missing.length > 0) {
  console.log(`No ids (app falls back to UTC offsets): ${missing.join(', ')}`);
}
