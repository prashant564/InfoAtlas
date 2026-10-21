import type {StateCreator} from 'zustand';

import {CountryDetailsItem} from '@services/api';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';
import {load, remove, save} from '@utils/storageUtils';
import {
  FAV_COUNTRIES_LIST_KEY,
  FAV_COUNTRY_CODES_KEY,
  FAV_COUTRIES_NAME_LIST_KEY,
} from '@utils/constants';

export type FavCountriesState = {
  favCountryCodes: string[];
  __fetchAllFavCountriesDetails: () => Promise<void>;
  __addCountryToFavorties: (
    selectedCountry: CountryDetailsItem,
  ) => Promise<void>;
  __removeCountryFromFavorties: (cca3: string) => Promise<void>;
};

export const initialFavCountriesState = {
  favCountryCodes: [],
};

/**
 * v1.1.0 and earlier stored full country objects plus a parallel list of
 * names. Convert them to cca3 codes once and drop the old keys.
 */
const migrateLegacyFavourites = async (): Promise<string[]> => {
  const legacyList: CountryDetailsItem[] | null = await load(
    FAV_COUNTRIES_LIST_KEY,
  );
  const codes = (legacyList ?? [])
    .map(country => country?.cca3)
    .filter((code): code is string => typeof code === 'string');
  const uniqueCodes = [...new Set(codes)];

  await save(FAV_COUNTRY_CODES_KEY, uniqueCodes);
  await remove(FAV_COUNTRIES_LIST_KEY);
  await remove(FAV_COUTRIES_NAME_LIST_KEY);

  return uniqueCodes;
};

export const createFavCountriesSlice: StateCreator<
  AppState,
  [],
  [],
  FavCountriesState
> = (set, get) => ({
  ...initialFavCountriesState,
  __fetchAllFavCountriesDetails: async () => {
    try {
      const saved: string[] | null = await load(FAV_COUNTRY_CODES_KEY);
      const favCountryCodes = Array.isArray(saved)
        ? saved
        : await migrateLegacyFavourites();
      set({favCountryCodes});
    } catch (error) {
      devLogger('__fetchAllFavCountriesDetails', error, 'fail');
    }
  },
  __addCountryToFavorties: async (selectedCountry: CountryDetailsItem) => {
    const {favCountryCodes} = get();
    if (favCountryCodes.includes(selectedCountry.cca3)) {
      return;
    }
    const updatedCodes = [...favCountryCodes, selectedCountry.cca3];
    set({favCountryCodes: updatedCodes});
    await save(FAV_COUNTRY_CODES_KEY, updatedCodes);
  },
  __removeCountryFromFavorties: async (cca3: string) => {
    const updatedCodes = get().favCountryCodes.filter(code => code !== cca3);
    set({favCountryCodes: updatedCodes});
    await save(FAV_COUNTRY_CODES_KEY, updatedCodes);
  },
});

/**
 * Favourite countries in the order they were added. All countries ship
 * with the app, so this works offline.
 */
export const getFavCountries = (
  countries: CountryDetailsItem[],
  favCountryCodes: string[],
): CountryDetailsItem[] => {
  const byCode = new Map(countries.map(country => [country.cca3, country]));
  return favCountryCodes
    .map(code => byCode.get(code))
    .filter((country): country is CountryDetailsItem => country !== undefined);
};
