import {
  createCountriesSlice,
  getCountriesByCode,
} from '@store/stores/countries';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {CountryDetailsItem} from '@services/api';
import {
  checkForCountriesUpdate,
  fetchNewerCountries,
  loadLocalCountries,
} from '@services/countries';

jest.mock('@services/countries', () => ({
  loadLocalCountries: jest.fn(),
  fetchNewerCountries: jest.fn(),
  checkForCountriesUpdate: jest.fn(),
}));

const mockDevLogger = jest.fn();
jest.mock('@utils/logger', () => ({
  devLogger: (...args: any[]) => mockDevLogger(...args),
}));

const mockLoadLocal = loadLocalCountries as jest.Mock;
const mockFetchNewer = fetchNewerCountries as jest.Mock;
const mockCheck = checkForCountriesUpdate as jest.Mock;

const country = (common: string, cca3: string) =>
  ({name: {common, official: common, nativeName: {}}, cca3} as any);

describe('Countries Slice', () => {
  let set: jest.Mock;
  let countriesSlice: ReturnType<typeof createCountriesSlice>;

  beforeEach(() => {
    jest.clearAllMocks();
    set = jest.fn();
    countriesSlice = createCountriesSlice(
      set,
      () => ({countriesDataVersion: 2} as AppState),
      {} as StoreApi<AppState>,
    );
  });

  test('initialises empty and not loaded', () => {
    expect(countriesSlice.allCountryDetailsList).toEqual([]);
    expect(countriesSlice.isCountriesLoaded).toBe(false);
  });

  test('sets local data, then keeps it when nothing newer is published', async () => {
    const local = {
      version: 1,
      updatedAt: '2026-10-21',
      countries: [country('India', 'IND')],
    };
    mockLoadLocal.mockResolvedValueOnce(local);
    mockFetchNewer.mockResolvedValueOnce(null);

    await countriesSlice.__fetchAllCountriesDetails();

    expect(mockFetchNewer).toHaveBeenCalledWith(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({
      allCountryDetailsList: local.countries,
      countriesDataVersion: 1,
      countriesDataUpdatedAt: '2026-10-21',
      isCountriesLoaded: true,
    });
  });

  test('upgrades to a newer remote dataset', async () => {
    const newer = {version: 2, countries: [country('Nepal', 'NPL')]};
    mockLoadLocal.mockResolvedValueOnce({version: 1, countries: []});
    mockFetchNewer.mockResolvedValueOnce(newer);

    await countriesSlice.__fetchAllCountriesDetails();

    expect(set).toHaveBeenLastCalledWith({
      allCountryDetailsList: newer.countries,
      countriesDataVersion: 2,
      countriesDataUpdatedAt: null,
    });
  });

  test('logs and keeps local data when the refresh throws', async () => {
    const error = new Error('boom');
    mockLoadLocal.mockResolvedValueOnce({version: 1, countries: []});
    mockFetchNewer.mockRejectedValueOnce(error);

    await countriesSlice.__fetchAllCountriesDetails();

    expect(set).toHaveBeenCalledTimes(1);
    expect(mockDevLogger).toHaveBeenCalledWith(
      '__fetchAllCountriesDetails',
      error,
      'fail',
    );
  });

  describe('__checkForCountriesUpdate', () => {
    test('applies an update and reports it', async () => {
      const dataset = {
        version: 3,
        updatedAt: '2026-11-01',
        countries: [country('Nepal', 'NPL')],
      };
      mockCheck.mockResolvedValueOnce({kind: 'updated', dataset});

      expect(await countriesSlice.__checkForCountriesUpdate()).toBe('updated');
      expect(mockCheck).toHaveBeenCalledWith(2);
      expect(set).toHaveBeenCalledWith({
        allCountryDetailsList: dataset.countries,
        countriesDataVersion: 3,
        countriesDataUpdatedAt: '2026-11-01',
      });
    });

    test('reports up to date without touching state', async () => {
      mockCheck.mockResolvedValueOnce({kind: 'up-to-date'});
      expect(await countriesSlice.__checkForCountriesUpdate()).toBe(
        'up-to-date',
      );
      expect(set).not.toHaveBeenCalled();
    });

    test('reports failed when the check throws', async () => {
      mockCheck.mockRejectedValueOnce(new Error('disk full'));
      expect(await countriesSlice.__checkForCountriesUpdate()).toBe('failed');
    });
  });

  test('getCountriesByCode indexes by cca3', () => {
    const india: CountryDetailsItem = country('India', 'IND');
    expect(getCountriesByCode([india])).toEqual({IND: india});
  });
});
