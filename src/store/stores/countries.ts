import type {StateCreator} from 'zustand';

import {CountryDetailsItem} from '@services/api';
import {
  CountriesUpdateResult,
  checkForCountriesUpdate,
  fetchNewerCountries,
  loadLocalCountries,
} from '@services/countries';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';

export type CountriesState = {
  allCountryDetailsList: CountryDetailsItem[];
  countriesDataVersion: number;
  /** Publish date of the dataset in use (YYYY-MM-DD). */
  countriesDataUpdatedAt: string | null;
  isCountriesLoaded: boolean;
  __fetchAllCountriesDetails: () => Promise<void>;
  /** A user-initiated check, e.g. from Settings. */
  __checkForCountriesUpdate: () => Promise<CountriesUpdateResult['kind']>;
};

export const initialCountriesState = {
  allCountryDetailsList: [],
  countriesDataVersion: 0,
  countriesDataUpdatedAt: null,
  isCountriesLoaded: false,
};

export const createCountriesSlice: StateCreator<
  AppState,
  [],
  [],
  CountriesState
> = (set, get) => ({
  ...initialCountriesState,
  __fetchAllCountriesDetails: async () => {
    try {
      // Show local data straight away, then upgrade in the background.
      const local = await loadLocalCountries();
      set({
        allCountryDetailsList: local.countries,
        countriesDataVersion: local.version,
        countriesDataUpdatedAt: local.updatedAt ?? null,
        isCountriesLoaded: true,
      });

      const newer = await fetchNewerCountries(local.version);
      if (newer) {
        set({
          allCountryDetailsList: newer.countries,
          countriesDataVersion: newer.version,
          countriesDataUpdatedAt: newer.updatedAt ?? null,
        });
      }
    } catch (error) {
      devLogger('__fetchAllCountriesDetails', error, 'fail');
    }
  },
  __checkForCountriesUpdate: async () => {
    try {
      const result = await checkForCountriesUpdate(get().countriesDataVersion);
      if (result.kind === 'updated') {
        set({
          allCountryDetailsList: result.dataset.countries,
          countriesDataVersion: result.dataset.version,
          countriesDataUpdatedAt: result.dataset.updatedAt ?? null,
        });
      }
      return result.kind;
    } catch (error) {
      devLogger('__checkForCountriesUpdate', error, 'fail');
      return 'failed';
    }
  },
});

/**
 * Maps a cca3 code to its country, e.g. to resolve `borders`.
 */
export const getCountriesByCode = (
  countries: CountryDetailsItem[],
): Record<string, CountryDetailsItem> =>
  Object.fromEntries(countries.map(country => [country.cca3, country]));
