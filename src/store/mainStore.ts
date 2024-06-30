import {createWithEqualityFn} from 'zustand/traditional';
import {shallow} from 'zustand/shallow';

import {
  CountriesState,
  createCountriesSlice,
  initialCountriesState,
} from './stores';

export type AppState = CountriesState;

export const initialAppState = {
  ...initialCountriesState,
};

export const useAppBoundStore = createWithEqualityFn<AppState>()(
  (...a) => ({
    ...createCountriesSlice(...a),
  }),
  shallow,
);
