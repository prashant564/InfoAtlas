import {createWithEqualityFn} from 'zustand/traditional';
import {shallow} from 'zustand/shallow';

import {
  //countries
  CountriesState,
  createCountriesSlice,
  initialCountriesState,

  //favCountries
  FavCountriesState,
  createFavCountriesSlice,
  initialFavCountriesState,
} from './stores';

export type AppState = CountriesState & FavCountriesState;

export const initialAppState = {
  ...initialCountriesState,
  ...initialFavCountriesState,
};

export const useAppBoundStore = createWithEqualityFn<AppState>()(
  (...a) => ({
    ...createCountriesSlice(...a),
    ...createFavCountriesSlice(...a),
  }),
  shallow,
);
