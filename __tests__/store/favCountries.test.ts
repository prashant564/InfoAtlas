import { createFavCountriesSlice, initialFavCountriesState } from '@store/stores/favCountries';
import { CountryDetailsItem } from '@services/api';
import { StoreApi } from 'zustand';
import { AppState } from '@store/mainStore';
import { FAV_COUNTRIES_LIST_KEY, FAV_COUTRIES_NAME_LIST_KEY } from '@utils/constants';
import { load, save } from '@utils/storageUtils';
import { devLogger } from '@utils/logger';

jest.mock('@utils/logger', () => ({
  devLogger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
}));

const mockCountryDetailsItem: CountryDetailsItem = {
  name: { common: 'Test Country', official: 'Test Country Official' },
  cca2: 'TC',
  cca3: 'TCY',
  idd: { root: '+1', suffixes: ['234'] },
  latlng: [10, 20],
  area: 100,
  population: 1000,
  timezones: ['UTC+0'],
  flags: { png: 'test.png', svg: 'test.svg', alt: 'Test Flag' },
  coatOfArms: { png: 'test.png', svg: 'test.svg' },
  capital: ['Test Capital'],
  region: 'Test Region',
  subregion: 'Test Subregion',
  maps: { googleMaps: 'gmaps', openStreetMaps: 'osm' },
  car: { signs: ['TC'], side: 'right' },
  continents: ['Test Continent'],
  currencies: { TCC: { name: 'Test Currency', symbol: 'TCS' } },
  languages: { eng: 'English' },
  tld: ['.tc'],
  demonyms: { eng: { f: 'Test Female', m: 'Test Male' } },
  borders: ['TB1', 'TB2'],
  independent: true,
  landlocked: false,
  unMember: true,
};

const mockCountry: CountryDetailsItem = {
  name: { common: 'Test Country', official: 'Official Test Country', nativeName: {} },
  tld: ['.tc'],
  cca2: 'TC',
  ccn3: '123',
  cca3: 'TCO',
  cioc: 'TOC',
  independent: true,
  status: 'officially-assigned',
  unMember: true,
  currencies: {},
  idd: {},
  capital: ['Test Capital'],
  altSpellings: ['TC'],
  region: 'Test Region',
  subregion: 'Test Subregion',
  languages: {},
  translations: {},
  latlng: [0, 0],
  landlocked: false,
  area: 1000,
  demonyms: {},
  flag: '🇹🇨',
  maps: {},
  population: 100,
  gini: {},
  fifa: 'TCO',
  car: { signs: ['TC'], side: 'right' },
  timezones: ['UTC'],
  continents: ['Test Continent'],
  flags: { png: '', svg: '', alt: 'flag' },
  coatOfArms: {},
  startOfWeek: 'monday',
  capitalInfo: {},
};

const anotherMockCountry: CountryDetailsItem = {
  name: { common: 'Another Country', official: 'Official Another Country', nativeName: {} },
  tld: ['.ac'],
  cca2: 'AC',
  ccn3: '456',
  cca3: 'ACO',
  cioc: 'AOC',
  independent: true,
  status: 'officially-assigned',
  unMember: true,
  currencies: {},
  idd: {},
  capital: ['Another Capital'],
  altSpellings: ['AC'],
  region: 'Another Region',
  subregion: 'Another Subregion',
  languages: {},
  translations: {},
  latlng: [1, 1],
  landlocked: false,
  area: 2000,
  demonyms: {},
  flag: '🇦🇨',
  maps: {},
  population: 200,
  gini: {},
  fifa: 'ACO',
  car: { signs: ['AC'], side: 'left' },
  timezones: ['UTC'],
  continents: ['Another Continent'],
  flags: { png: '', svg: '', alt: 'flag' },
  coatOfArms: {},
  startOfWeek: 'tuesday',
  capitalInfo: {},
};

describe('FavCountries Slice', () => {
  let set: jest.Mock;
  let get: jest.Mock;
  let store: StoreApi<AppState>;
  let favCountriesSlice: ReturnType<typeof createFavCountriesSlice>;

  beforeEach(() => {
    jest.clearAllMocks();
    set = jest.fn();
    get = jest.fn(() => ({ ...initialFavCountriesState }));
    store = {} as StoreApi<AppState>;
    favCountriesSlice = createFavCountriesSlice(set, get, store);
  });

  it('should initialize with default state', () => {
    expect(favCountriesSlice.favCountriesList).toEqual(initialFavCountriesState.favCountriesList);
  });

  describe('__fetchAllFavCountriesDetails', () => {
    it('should fetch favorite countries successfully', async () => {
      const sampleFavCountries: CountryDetailsItem[] = [mockCountryDetailsItem];
      (load as jest.Mock).mockResolvedValue(sampleFavCountries);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(load).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY);
      expect(set).toHaveBeenCalledWith({ favCountriesList: sampleFavCountries });
    });

    it('should handle empty list when fetching', async () => {
      (load as jest.Mock).mockResolvedValue(null);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(load).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY);
      expect(set).not.toHaveBeenCalled();
    });

    it('should handle error when fetching', async () => {
      const mockError = new Error('Failed to load');
      (load as jest.Mock).mockRejectedValue(mockError);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(load).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY);
      expect(devLogger.error).toHaveBeenCalledWith('Error loading fav countries list from storage:', mockError);
      expect(set).not.toHaveBeenCalled();
    });
  });

  describe('__addCountryToFavorties', () => {
    it('should add a country to favorites when list is initially empty', async () => {
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve(null);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve(null);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockResolvedValue(undefined);

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(load).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY);
      expect(load).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY);
      expect(save).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY, [mockCountry.name.common]);
      expect(save).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY, [mockCountry]);
    });

    it('should add a country to favorites when list has existing items', async () => {
      const existingName = 'Existing Country';
      const existingCountry: CountryDetailsItem = { ...mockCountry, name: { ...mockCountry.name, common: existingName } };
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve([existingName]);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve([existingCountry]);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockResolvedValue(undefined);

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(save).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY, [existingName, mockCountry.name.common]);
      expect(save).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY, [existingCountry, mockCountry]);
    });

    it('should handle error when adding a country to favorites', async () => {
      const mockSaveError = new Error('Failed to save country list');
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve(null);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve(null);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve(undefined); // First save (names) succeeds
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.reject(mockSaveError); // Second save (details) fails
        return Promise.resolve(undefined);
      });

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(devLogger.error).toHaveBeenCalledWith(
        `Error saving fav countries list for key ${FAV_COUNTRIES_LIST_KEY}:`,
        mockSaveError,
      );
    });
  });

  describe('__removeCountryFromFavorties', () => {
    it('should remove a country from favorites', async () => {
      const countryNameToRemove = mockCountry.name.common;
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve([countryNameToRemove, anotherMockCountry.name.common]);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve([mockCountry, anotherMockCountry]);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockResolvedValue(undefined);

      await favCountriesSlice.__removeCountryFromFavorties(countryNameToRemove);

      expect(load).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY);
      expect(load).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY);
      expect(save).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY, [anotherMockCountry.name.common]);
      expect(save).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY, [anotherMockCountry]);
    });

    it('should handle removing a non-existent country', async () => {
      const countryNameToRemove = 'NonExistentCountry';
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve([mockCountry.name.common]);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve([mockCountry]);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockResolvedValue(undefined);

      await favCountriesSlice.__removeCountryFromFavorties(countryNameToRemove);

      expect(save).toHaveBeenCalledWith(FAV_COUTRIES_NAME_LIST_KEY, [mockCountry.name.common]);
      expect(save).toHaveBeenCalledWith(FAV_COUNTRIES_LIST_KEY, [mockCountry]);
    });

    it('should handle error when removing a country from favorites', async () => {
      const countryNameToRemove = mockCountry.name.common;
      const mockSaveError = new Error('Failed to save updated country list');
      (load as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve([countryNameToRemove]);
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.resolve([mockCountry]);
        return Promise.resolve(null);
      });
      (save as jest.Mock).mockImplementation((key: string) => {
        if (key === FAV_COUTRIES_NAME_LIST_KEY) return Promise.resolve(undefined); // First save (names) succeeds
        if (key === FAV_COUNTRIES_LIST_KEY) return Promise.reject(mockSaveError); // Second save (details) fails
        return Promise.resolve(undefined);
      });

      await favCountriesSlice.__removeCountryFromFavorties(countryNameToRemove);

      expect(devLogger.error).toHaveBeenCalledWith(
        `Error saving fav countries list for key ${FAV_COUNTRIES_LIST_KEY}:`,
        mockSaveError,
      );
    });
  });
});
