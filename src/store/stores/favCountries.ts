import type {StateCreator} from 'zustand';

import {CountryDetailsItem} from '@services/api';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';
import {load, save} from '@utils/storageUtils';
import {
  FAV_COUNTRIES_LIST_KEY,
  FAV_COUTRIES_NAME_LIST_KEY,
} from '@utils/constants';

export type FavCountriesState = {
  favCountriesList: CountryDetailsItem[];
  __fetchAllFavCountriesDetails: () => void;
  __addCountryToFavorties: (selectedCountry: CountryDetailsItem) => void;
  __removeCountryFromFavorties: (countryName: string) => void;
};

export const initialFavCountriesState = {
  favCountriesList: [],
};

export const createFavCountriesSlice: StateCreator<
  AppState,
  [],
  [],
  FavCountriesState
> = set => ({
  ...initialFavCountriesState,
  __fetchAllFavCountriesDetails: async () => {
    try {
      load(FAV_COUNTRIES_LIST_KEY).then(async res => {
        if (res !== null) {
          set({
            favCountriesList: res,
          });
        }
      });
    } catch (error) {
      devLogger(
        'favCountryList in __fetchAllFavCountriesDetails',
        error,
        'fail',
      );
    }
  },
  __addCountryToFavorties: async (selectedCountry: CountryDetailsItem) => {
    try {
      const {name} = selectedCountry;
      load(FAV_COUTRIES_NAME_LIST_KEY).then(async res => {
        if (res !== null) {
          let updatedList = [...res, name.common];
          await save(FAV_COUTRIES_NAME_LIST_KEY, updatedList);
        } else {
          let newList = [name.common];
          await save(FAV_COUTRIES_NAME_LIST_KEY, newList);
        }
      });

      load(FAV_COUNTRIES_LIST_KEY).then(async res => {
        if (res !== null) {
          let updatedList = [...res, selectedCountry];
          await save(FAV_COUNTRIES_LIST_KEY, updatedList);
        } else {
          let newList = [selectedCountry];
          await save(FAV_COUNTRIES_LIST_KEY, newList);
        }
      });
    } catch (error) {
      devLogger('favCountryList in __addCountryToFavorties', error, 'fail');
    }
  },
  __removeCountryFromFavorties: async (countryName: string) => {
    try {
      load(FAV_COUTRIES_NAME_LIST_KEY).then(async res => {
        if (res !== null) {
          let filteredList = res.filter((item: string) => item !== countryName);
          await save(FAV_COUTRIES_NAME_LIST_KEY, filteredList);
        }
      });

      load(FAV_COUNTRIES_LIST_KEY).then(async res => {
        if (res !== null) {
          let filteredList = res.filter(
            (country: CountryDetailsItem) =>
              country.name.common !== countryName,
          );
          await save(FAV_COUNTRIES_LIST_KEY, filteredList);
        }
      });
    } catch (error) {
      devLogger(
        'favCountryList in __removeCountryFromFavorties',
        error,
        'fail',
      );
    }
  },
});
