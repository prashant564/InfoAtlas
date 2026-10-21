import {
  TravelEntries,
  createTravelSlice,
  getCountriesWithStatus,
  getTravelStats,
} from '@store/stores/travel';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {load, remove, save} from '@utils/storageUtils';
import {bundledDataset} from '@services/countries';

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}));

const mockDevLogger = jest.fn();
jest.mock('@utils/logger', () => ({
  devLogger: (...args: any[]) => mockDevLogger(...args),
}));

const mockLoad = load as jest.Mock;
const mockSave = save as jest.Mock;
const mockRemove = remove as jest.Mock;

const country = (common: string, cca3: string) =>
  ({name: {common, official: common, nativeName: {}}, cca3} as any);

const wishlistOf = (codes: string[]) =>
  Object.fromEntries(
    codes.map(code => [
      code,
      {status: 'wishlist', updatedAt: expect.any(String)},
    ]),
  );

describe('Travel Slice', () => {
  let state: Partial<AppState>;
  let set: jest.Mock;
  let slice: ReturnType<typeof createTravelSlice>;

  beforeEach(() => {
    jest.clearAllMocks();
    state = {travelEntries: {}};
    set = jest.fn(partial => Object.assign(state, partial));
    slice = createTravelSlice(
      set,
      () => state as AppState,
      {} as StoreApi<AppState>,
    );
  });

  describe('__loadTravelEntries', () => {
    test('loads saved entries without migrating', async () => {
      const saved = {IND: {status: 'visited', updatedAt: '2026-01-01'}};
      mockLoad.mockResolvedValueOnce(saved);

      await slice.__loadTravelEntries();

      expect(mockLoad).toHaveBeenCalledWith('travelEntries');
      expect(state.travelEntries).toEqual(saved);
      expect(mockRemove).not.toHaveBeenCalled();
    });

    test('moves v1.2 favourite codes into the wishlist', async () => {
      mockLoad
        .mockResolvedValueOnce(null) // travelEntries
        .mockResolvedValueOnce(['IND', 'CAN']); // favCountryCodes

      await slice.__loadTravelEntries();

      expect(state.travelEntries).toEqual(wishlistOf(['IND', 'CAN']));
      expect(mockSave).toHaveBeenCalledWith(
        'travelEntries',
        state.travelEntries,
      );
      ['favCountryCodes', 'favCountryList', 'favNameList'].forEach(key =>
        expect(mockRemove).toHaveBeenCalledWith(key),
      );
    });

    test('moves v1.1 favourite objects into the wishlist', async () => {
      mockLoad
        .mockResolvedValueOnce(null) // travelEntries
        .mockResolvedValueOnce(null) // favCountryCodes
        .mockResolvedValueOnce([country('Canada', 'CAN'), {name: {}}]); // favCountryList

      await slice.__loadTravelEntries();

      expect(state.travelEntries).toEqual(wishlistOf(['CAN']));
    });

    test('starts empty on a fresh install', async () => {
      mockLoad.mockResolvedValue(null);

      await slice.__loadTravelEntries();

      expect(state.travelEntries).toEqual({});
    });

    test('logs storage errors', async () => {
      const error = new Error('Storage Error');
      mockLoad.mockRejectedValueOnce(error);

      await slice.__loadTravelEntries();

      expect(set).not.toHaveBeenCalled();
      expect(mockDevLogger).toHaveBeenCalledWith(
        '__loadTravelEntries',
        error,
        'fail',
      );
    });
  });

  describe('__setTravelStatus', () => {
    test('sets a status and persists it', async () => {
      await slice.__setTravelStatus('IND', 'visited');

      expect(state.travelEntries).toEqual({
        IND: {status: 'visited', updatedAt: expect.any(String)},
      });
      expect(mockSave).toHaveBeenCalledWith(
        'travelEntries',
        state.travelEntries,
      );
    });

    test('a country is never both visited and on the wishlist', async () => {
      await slice.__setTravelStatus('IND', 'wishlist');
      await slice.__setTravelStatus('IND', 'visited');

      expect(state.travelEntries!.IND.status).toBe('visited');
      expect(Object.keys(state.travelEntries!)).toEqual(['IND']);
    });

    test('null clears the status without touching others', async () => {
      state.travelEntries = {
        IND: {status: 'visited', updatedAt: '2026-01-01'},
        CAN: {status: 'wishlist', updatedAt: '2026-01-02'},
      };

      await slice.__setTravelStatus('IND', null);

      expect(state.travelEntries).toEqual({
        CAN: {status: 'wishlist', updatedAt: '2026-01-02'},
      });
    });
  });
});

describe('travel selectors', () => {
  const countries = bundledDataset.countries;
  const entries: TravelEntries = {
    FRA: {status: 'visited', updatedAt: '2026-03-01T00:00:00.000Z'},
    JPN: {status: 'visited', updatedAt: '2026-05-01T00:00:00.000Z'},
    GRL: {status: 'visited', updatedAt: '2026-01-01T00:00:00.000Z'}, // territory
    PER: {status: 'wishlist', updatedAt: '2026-02-01T00:00:00.000Z'},
  };

  test('getCountriesWithStatus lists the most recent first', () => {
    expect(
      getCountriesWithStatus(countries, entries, 'visited').map(c => c.cca3),
    ).toEqual(['JPN', 'FRA', 'GRL']);
    expect(
      getCountriesWithStatus(countries, entries, 'wishlist').map(c => c.cca3),
    ).toEqual(['PER']);
  });

  test('getTravelStats counts UN members as countries', () => {
    expect(getTravelStats(countries, entries)).toEqual({
      visitedCountries: 2,
      visitedTerritories: 1,
      totalCountries: 193,
      visitedPercent: 1,
      visitedContinents: 3,
      totalContinents: 7,
      wishlistCount: 1,
    });
  });

  test('getTravelStats with nothing visited', () => {
    expect(getTravelStats(countries, {})).toMatchObject({
      visitedCountries: 0,
      visitedPercent: 0,
      visitedContinents: 0,
    });
  });
});
