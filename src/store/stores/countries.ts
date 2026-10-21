import type {StateCreator} from 'zustand';

import {CountryDetailsItem} from '@services/api';
import {fetchNewerCountries, loadLocalCountries} from '@services/countries';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';

export type CountriesState = {
  allCountryDetailsList: CountryDetailsItem[];
  countriesDataVersion: number;
  isCountriesLoaded: boolean;
  __fetchAllCountriesDetails: () => Promise<void>;
};

export const initialCountriesState = {
  allCountryDetailsList: [],
  countriesDataVersion: 0,
  isCountriesLoaded: false,
};

export const createCountriesSlice: StateCreator<
  AppState,
  [],
  [],
  CountriesState
> = set => ({
  ...initialCountriesState,
  __fetchAllCountriesDetails: async () => {
    try {
      // Show local data straight away, then upgrade in the background.
      const local = await loadLocalCountries();
      set({
        allCountryDetailsList: local.countries,
        countriesDataVersion: local.version,
        isCountriesLoaded: true,
      });

      const newer = await fetchNewerCountries(local.version);
      if (newer) {
        set({
          allCountryDetailsList: newer.countries,
          countriesDataVersion: newer.version,
        });
      }
    } catch (error) {
      devLogger('__fetchAllCountriesDetails', error, 'fail');
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
