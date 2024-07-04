import type {StateCreator} from 'zustand';

import {CountryDetailsItem, getAllCountriesData} from '@services/api';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';

export type CountriesState = {
  allCountryDetailsList: CountryDetailsItem[];
  __fetchAllCountriesDetails: () => void;
};

export const initialCountriesState = {
  allCountryDetailsList: [],
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
      const res = await getAllCountriesData();
      if (res.kind === 'ok') {
        const allCountryDetailsList = res.data || [];
        set({
          allCountryDetailsList,
        });
      }
    } catch (error) {
      devLogger(
        'getAllCountriesData in __fetchAllCountriesDetails',
        error,
        'fail',
      );
    }
  },
});
