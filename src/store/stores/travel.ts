import type {StateCreator} from 'zustand';

import {CountryDetailsItem} from '@services/api';

import {AppState} from '@store/mainStore';

import {devLogger} from '@utils/logger';
import {load, remove, save} from '@utils/storageUtils';
import {
  FAV_COUNTRIES_LIST_KEY,
  FAV_COUNTRY_CODES_KEY,
  FAV_COUTRIES_NAME_LIST_KEY,
  TRAVEL_ENTRIES_KEY,
} from '@utils/constants';

export type TravelStatus = 'visited' | 'wishlist';

export type TravelEntry = {
  status: TravelStatus;
  updatedAt: string;
};

/**
 * Keyed by cca3. A country is either visited or on the wishlist, never both.
 */
export type TravelEntries = Record<string, TravelEntry>;

export type TravelState = {
  travelEntries: TravelEntries;
  __loadTravelEntries: () => Promise<void>;
  __setTravelStatus: (
    cca3: string,
    status: TravelStatus | null,
  ) => Promise<void>;
  __clearTravelEntries: () => Promise<void>;
};

export const initialTravelState = {
  travelEntries: {},
};

const isTravelEntries = (value: any): value is TravelEntries =>
  value != null && typeof value === 'object' && !Array.isArray(value);

/**
 * Favourites (hearts) became the wishlist. Reads, in order of preference,
 * v1.2 favourite codes and v1.1 favourite country objects.
 */
const migrateFavouritesToWishlist = async (): Promise<TravelEntries> => {
  const favCodes: string[] | null = await load(FAV_COUNTRY_CODES_KEY);
  const legacyList: CountryDetailsItem[] | null = Array.isArray(favCodes)
    ? null
    : await load(FAV_COUNTRIES_LIST_KEY);

  const codes = Array.isArray(favCodes)
    ? favCodes
    : (legacyList ?? []).map(country => country?.cca3);

  const updatedAt = new Date().toISOString();
  const entries: TravelEntries = {};
  codes
    .filter((code): code is string => typeof code === 'string')
    .forEach(code => {
      entries[code] = {status: 'wishlist', updatedAt};
    });

  await save(TRAVEL_ENTRIES_KEY, entries);
  await remove(FAV_COUNTRY_CODES_KEY);
  await remove(FAV_COUNTRIES_LIST_KEY);
  await remove(FAV_COUTRIES_NAME_LIST_KEY);

  return entries;
};

export const createTravelSlice: StateCreator<AppState, [], [], TravelState> = (
  set,
  get,
) => ({
  ...initialTravelState,
  __loadTravelEntries: async () => {
    try {
      const saved = await load(TRAVEL_ENTRIES_KEY);
      const travelEntries = isTravelEntries(saved)
        ? saved
        : await migrateFavouritesToWishlist();
      set({travelEntries});
    } catch (error) {
      devLogger('__loadTravelEntries', error, 'fail');
    }
  },
  __setTravelStatus: async (cca3: string, status: TravelStatus | null) => {
    const travelEntries: TravelEntries = {...get().travelEntries};
    if (status === null) {
      delete travelEntries[cca3];
    } else {
      travelEntries[cca3] = {status, updatedAt: new Date().toISOString()};
    }
    set({travelEntries});
    await save(TRAVEL_ENTRIES_KEY, travelEntries);
  },
  __clearTravelEntries: async () => {
    set({travelEntries: {}});
    await save(TRAVEL_ENTRIES_KEY, {});
  },
});

/**
 * Countries with `status`, most recently marked first. All countries ship
 * with the app, so this works offline.
 */
export const getCountriesWithStatus = (
  countries: CountryDetailsItem[],
  travelEntries: TravelEntries,
  status: TravelStatus,
): CountryDetailsItem[] =>
  countries
    .filter(country => travelEntries[country.cca3]?.status === status)
    .sort((a, b) =>
      travelEntries[b.cca3].updatedAt.localeCompare(
        travelEntries[a.cca3].updatedAt,
      ),
    );

export type TravelStats = {
  visitedCountries: number;
  visitedTerritories: number;
  totalCountries: number;
  visitedPercent: number;
  visitedContinents: number;
  totalContinents: number;
  wishlistCount: number;
};

/**
 * "Countries" are UN members (193), the usual way travellers count;
 * everything else is a territory.
 */
export const getTravelStats = (
  countries: CountryDetailsItem[],
  travelEntries: TravelEntries,
): TravelStats => {
  const visited = countries.filter(
    country => travelEntries[country.cca3]?.status === 'visited',
  );
  const totalCountries = countries.filter(country => country.unMember).length;
  const visitedCountries = visited.filter(country => country.unMember).length;

  const allContinents = new Set(
    countries.flatMap(country => country.continents ?? []),
  );
  const visitedContinents = new Set(
    visited.flatMap(country => country.continents ?? []),
  );

  return {
    visitedCountries,
    visitedTerritories: visited.length - visitedCountries,
    totalCountries,
    visitedPercent:
      totalCountries > 0
        ? Math.round((visitedCountries / totalCountries) * 100)
        : 0,
    visitedContinents: visitedContinents.size,
    totalContinents: allContinents.size,
    wishlistCount: Object.values(travelEntries).filter(
      entry => entry.status === 'wishlist',
    ).length,
  };
};
