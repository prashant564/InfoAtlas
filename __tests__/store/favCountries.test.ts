import {
  createFavCountriesSlice,
  getFavCountries,
} from '@store/stores/favCountries';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {load, remove, save} from '@utils/storageUtils';

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

const canada = country('Canada', 'CAN');
const india = country('India', 'IND');

describe('FavCountries Slice', () => {
  let state: Partial<AppState>;
  let set: jest.Mock;
  let favSlice: ReturnType<typeof createFavCountriesSlice>;

  beforeEach(() => {
    jest.clearAllMocks();
    state = {favCountryCodes: []};
    set = jest.fn(partial => Object.assign(state, partial));
    favSlice = createFavCountriesSlice(
      set,
      () => state as AppState,
      {} as StoreApi<AppState>,
    );
  });

  test('initialises with no favourites', () => {
    expect(favSlice.favCountryCodes).toEqual([]);
  });

  describe('__fetchAllFavCountriesDetails', () => {
    test('loads saved codes', async () => {
      mockLoad.mockResolvedValueOnce(['IND', 'CAN']);

      await favSlice.__fetchAllFavCountriesDetails();

      expect(mockLoad).toHaveBeenCalledWith('favCountryCodes');
      expect(state.favCountryCodes).toEqual(['IND', 'CAN']);
      expect(mockRemove).not.toHaveBeenCalled();
    });

    test('migrates v1.1.0 favourites to codes and removes legacy keys', async () => {
      mockLoad
        .mockResolvedValueOnce(null) // favCountryCodes
        .mockResolvedValueOnce([canada, india, canada]); // favCountryList

      await favSlice.__fetchAllFavCountriesDetails();

      expect(state.favCountryCodes).toEqual(['CAN', 'IND']);
      expect(mockSave).toHaveBeenCalledWith('favCountryCodes', ['CAN', 'IND']);
      expect(mockRemove).toHaveBeenCalledWith('favCountryList');
      expect(mockRemove).toHaveBeenCalledWith('favNameList');
    });

    test('starts empty for a fresh install', async () => {
      mockLoad.mockResolvedValue(null);

      await favSlice.__fetchAllFavCountriesDetails();

      expect(state.favCountryCodes).toEqual([]);
    });

    test('logs storage errors', async () => {
      const error = new Error('Storage Error');
      mockLoad.mockRejectedValueOnce(error);

      await favSlice.__fetchAllFavCountriesDetails();

      expect(set).not.toHaveBeenCalled();
      expect(mockDevLogger).toHaveBeenCalledWith(
        '__fetchAllFavCountriesDetails',
        error,
        'fail',
      );
    });
  });

  describe('__addCountryToFavorties', () => {
    test('updates state immediately and persists', async () => {
      state.favCountryCodes = ['IND'];

      await favSlice.__addCountryToFavorties(canada);

      expect(state.favCountryCodes).toEqual(['IND', 'CAN']);
      expect(mockSave).toHaveBeenCalledWith('favCountryCodes', ['IND', 'CAN']);
    });

    test('ignores duplicates', async () => {
      state.favCountryCodes = ['CAN'];

      await favSlice.__addCountryToFavorties(canada);

      expect(set).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe('__removeCountryFromFavorties', () => {
    test('removes only the matching code', async () => {
      state.favCountryCodes = ['IND', 'CAN', 'USA'];

      await favSlice.__removeCountryFromFavorties('CAN');

      expect(state.favCountryCodes).toEqual(['IND', 'USA']);
      expect(mockSave).toHaveBeenCalledWith('favCountryCodes', ['IND', 'USA']);
    });
  });

  test('getFavCountries keeps the order favourites were added and skips unknown codes', () => {
    expect(getFavCountries([canada, india], ['IND', 'XXX', 'CAN'])).toEqual([
      india,
      canada,
    ]);
  });
});
