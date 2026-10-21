import {
  CountriesDataset,
  CountryDetailsItem,
  getCountriesDataset,
  getDataManifest,
} from '@services/api';

import {load, save} from '@utils/storageUtils';
import {COUNTRIES_DATASET_KEY} from '@utils/constants';

import bundledDatasetJson from '../../../data/countries.json';

const MIN_COUNTRIES = 200;

export const bundledDataset = bundledDatasetJson as unknown as CountriesDataset;

/**
 * Guards against caching or rendering a truncated / malformed download.
 */
export const isValidDataset = (data: any): data is CountriesDataset =>
  data != null &&
  typeof data.version === 'number' &&
  Array.isArray(data.countries) &&
  data.countries.length >= MIN_COUNTRIES &&
  data.countries.every(
    (country: any) =>
      typeof country?.name?.common === 'string' &&
      typeof country?.name?.official === 'string' &&
      typeof country?.cca3 === 'string',
  );

export const sortCountriesByName = (
  countries: CountryDetailsItem[],
): CountryDetailsItem[] =>
  [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common));

const withSortedCountries = (dataset: CountriesDataset): CountriesDataset => ({
  ...dataset,
  countries: sortCountriesByName(dataset.countries),
});

/**
 * Returns the newest dataset available without touching the network:
 * the cached download if it is newer than what shipped with the app,
 * otherwise the bundled one.
 */
export const loadLocalCountries = async (): Promise<CountriesDataset> => {
  const cached = await load(COUNTRIES_DATASET_KEY);
  if (isValidDataset(cached) && cached.version > bundledDataset.version) {
    return withSortedCountries(cached);
  }
  return withSortedCountries(bundledDataset);
};

/**
 * Downloads and caches the published dataset if it is newer than
 * `currentVersion`. Resolves to null when there is nothing newer or
 * anything goes wrong, so callers can keep showing local data.
 */
export const fetchNewerCountries = async (
  currentVersion: number,
): Promise<CountriesDataset | null> => {
  const manifest = await getDataManifest();
  if (manifest.kind !== 'ok' || manifest.data.version <= currentVersion) {
    return null;
  }

  const dataset = await getCountriesDataset();
  if (
    dataset.kind !== 'ok' ||
    !isValidDataset(dataset.data) ||
    dataset.data.version <= currentVersion
  ) {
    return null;
  }

  await save(COUNTRIES_DATASET_KEY, dataset.data);
  return withSortedCountries(dataset.data);
};
