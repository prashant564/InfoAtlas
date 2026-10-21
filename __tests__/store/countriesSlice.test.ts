import {
  createCountriesSlice,
  getCountriesByCode,
} from '@store/stores/countries';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {CountryDetailsItem} from '@services/api';
import {fetchNewerCountries, loadLocalCountries} from '@services/countries';

jest.mock('@services/countries', () => ({
  loadLocalCountries: jest.fn(),
  fetchNewerCountries: jest.fn(),
}));

const mockDevLogger = jest.fn();
jest.mock('@utils/logger', () => ({
  devLogger: (...args: any[]) => mockDevLogger(...args),
}));

const mockLoadLocal = loadLocalCountries as jest.Mock;
const mockFetchNewer = fetchNewerCountries as jest.Mock;

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
      jest.fn(),
      {} as StoreApi<AppState>,
    );
  });

  test('initialises empty and not loaded', () => {
    expect(countriesSlice.allCountryDetailsList).toEqual([]);
    expect(countriesSlice.isCountriesLoaded).toBe(false);
  });

  test('sets local data, then keeps it when nothing newer is published', async () => {
    const local = {version: 1, countries: [country('India', 'IND')]};
    mockLoadLocal.mockResolvedValueOnce(local);
    mockFetchNewer.mockResolvedValueOnce(null);

    await countriesSlice.__fetchAllCountriesDetails();

    expect(mockFetchNewer).toHaveBeenCalledWith(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({
      allCountryDetailsList: local.countries,
      countriesDataVersion: 1,
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

  test('getCountriesByCode indexes by cca3', () => {
    const india: CountryDetailsItem = country('India', 'IND');
    expect(getCountriesByCode([india])).toEqual({IND: india});
  });
});
