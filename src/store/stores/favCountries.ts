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
      const res = await load(FAV_COUNTRIES_LIST_KEY);
      if (res !== null) {
        set({
          favCountriesList: res,
        });
      }
    } catch (error) {
      devLogger(
        'favCountryList __fetchAllFavCountriesDetails: Error processing fav countries list',
        error,
        'fail',
      );
    }
  },
  __addCountryToFavorties: async (selectedCountry: CountryDetailsItem) => {
    try {
      const {name} = selectedCountry;
      const favCountriesNameList = await load(FAV_COUTRIES_NAME_LIST_KEY);
      if (favCountriesNameList !== null) {
        let updatedList = [...favCountriesNameList, name.common];
        await save(FAV_COUTRIES_NAME_LIST_KEY, updatedList);
      } else {
        let newList = [name.common];
        await save(FAV_COUTRIES_NAME_LIST_KEY, newList);
      }

      const favCountriesList = await load(FAV_COUNTRIES_LIST_KEY);
      if (favCountriesList !== null) {
        let updatedList = [...favCountriesList, selectedCountry];
        await save(FAV_COUNTRIES_LIST_KEY, updatedList);
      } else {
        let newList = [selectedCountry];
        await save(FAV_COUNTRIES_LIST_KEY, newList);
      }
    } catch (error) {
      devLogger('favCountryList in __addCountryToFavorties', error, 'fail');
    }
  },
  __removeCountryFromFavorties: async (countryName: string) => {
    try {
      const favCountriesNameList = await load(FAV_COUTRIES_NAME_LIST_KEY);
      if (favCountriesNameList !== null) {
        let filteredList = favCountriesNameList.filter(
          (item: string) => item !== countryName,
        );
        await save(FAV_COUTRIES_NAME_LIST_KEY, filteredList);
      }

      const favCountriesList = await load(FAV_COUNTRIES_LIST_KEY);
      if (favCountriesList !== null) {
        let filteredList = favCountriesList.filter(
          (country: CountryDetailsItem) => country.name.common !== countryName,
        );
        await save(FAV_COUNTRIES_LIST_KEY, filteredList);
      }
    } catch (error) {
      devLogger(
        'favCountryList in __removeCountryFromFavorties',
        error,
        'fail',
      );
    }
  },
});
