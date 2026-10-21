import {createWithEqualityFn} from 'zustand/traditional';
import {shallow} from 'zustand/shallow';

import {
  //countries
  CountriesState,
  createCountriesSlice,
  initialCountriesState,

  //travel
  TravelState,
  createTravelSlice,
  initialTravelState,
} from './stores';

export type AppState = CountriesState & TravelState;

export const initialAppState = {
  ...initialCountriesState,
  ...initialTravelState,
};

export const useAppBoundStore = createWithEqualityFn<AppState>()(
  (...a) => ({
    ...createCountriesSlice(...a),
    ...createTravelSlice(...a),
  }),
  shallow,
);
