#!/usr/bin/env node
/**
 * Validates data/countries.json and bumps the dataset version in both
 * data/countries.json and data/manifest.json.
 *
 * Usage:
 *   node scripts/release-data.js           # validate + bump version
 *   node scripts/release-data.js --check   # validate only (used by CI)
 *
 * Once the bumped files are merged to main, installed apps pick up the new
 * dataset on their next launch (see src/services/countries).
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATASET_PATH = path.join(DATA_DIR, 'countries.json');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');
const MIN_COUNTRIES = 200;

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');

const validate = (dataset, manifest) => {
  const errors = [];
  const {countries} = dataset;

  if (!Array.isArray(countries)) {
    return ['"countries" must be an array'];
  }
  if (countries.length < MIN_COUNTRIES) {
    errors.push(`expected at least ${MIN_COUNTRIES} countries`);
  }
  if (dataset.version !== manifest.version) {
    errors.push('dataset version and manifest version differ');
  }

  const seen = new Set();
  countries.forEach((country, i) => {
    const label = country?.name?.common || `#${i}`;
    if (!country?.name?.common || !country?.name?.official) {
      errors.push(`${label}: missing name.common / name.official`);
    }
    if (!country?.cca3) {
      errors.push(`${label}: missing cca3`);
    } else if (seen.has(country.cca3)) {
      errors.push(`${label}: duplicate cca3 ${country.cca3}`);
    } else {
      seen.add(country.cca3);
    }
    if (typeof country?.population !== 'number') {
      errors.push(`${label}: population must be a number`);
    }
    if (typeof country?.translations !== 'object') {
      errors.push(`${label}: missing translations`);
    }
  });

  return errors;
};

const dataset = readJson(DATASET_PATH);
const manifest = readJson(MANIFEST_PATH);
const checkOnly = process.argv.includes('--check');

const errors = validate(dataset, manifest);
if (errors.length > 0) {
  console.error(`Dataset is invalid:\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

if (checkOnly) {
  console.log(
    `Dataset OK: v${dataset.version}, ${dataset.countries.length} countries`,
  );
  process.exit(0);
}

const version = manifest.version + 1;
const updatedAt = new Date().toISOString().slice(0, 10);

writeJson(DATASET_PATH, {...dataset, version, updatedAt});
writeJson(MANIFEST_PATH, {
  version,
  updatedAt,
  count: dataset.countries.length,
});

console.log(
  `Released dataset v${version} (${dataset.countries.length} countries)`,
);
