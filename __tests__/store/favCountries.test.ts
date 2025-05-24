import {
  createFavCountriesSlice,
  initialFavCountriesState,
} from '@store/stores/favCountries';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {CountryDetailsItem} from '@services/api';
import {load, save} from '@utils/storageUtils';

// Mock dependencies
const mockLoad = jest.fn();
const mockSave = jest.fn();
const mockDevLogger = jest.fn();

// Set up mocks
jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
  loadString: jest.fn(),
  saveString: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@utils/logger', () => ({
  devLogger: (...args: any[]) => mockDevLogger(...args),
}));

jest.mock('@utils/constants', () => ({
  FAV_COUNTRIES_LIST_KEY: 'FAV_COUNTRIES_LIST_KEY',
  FAV_COUTRIES_NAME_LIST_KEY: 'FAV_COUTRIES_NAME_LIST_KEY',
}));

describe('FavCountries Slice', () => {
  let set: jest.Mock;
  let get: jest.Mock;
  let store: StoreApi<AppState>;
  let favCountriesSlice: any;

  const mockAppState = {
    ...initialFavCountriesState,
    __fetchAllFavCountriesDetails: jest.fn(),
    __addCountryToFavorties: jest.fn(),
    __removeCountryFromFavorties: jest.fn(),
  } as any;

  const mockCountry: CountryDetailsItem = {
    name: {
      common: 'Canada',
      official: 'Canada',
      nativeName: {},
    },
    tld: ['.ca'],
    cca2: 'CA',
    ccn3: '124',
    cioc: 'CAN',
    independent: true,
    status: 'officially-assigned',
    unMember: true,
    currencies: {
      CAD: {
        symbol: '$',
        name: 'Canadian dollar',
      },
    },
    idd: {
      root: '+1',
      suffixes: [''],
    },
    capital: ['Ottawa'],
    altSpellings: ['CA'],
    region: 'Americas',
    subregion: 'North America',
    languages: {
      eng: 'English',
      fra: 'French',
    },
    latlng: [60, -95],
    landlocked: false,
    borders: ['USA'],
    area: 9984670,
    demonyms: {
      eng: {
        f: 'Canadian',
        m: 'Canadian',
      },
      fra: {
        f: 'Canadienne',
        m: 'Canadien',
      },
    },
    cca3: 'CAN',
    translations: {},
    flag: '🇨🇦',
    maps: {
      googleMaps: 'https://goo.gl/maps/test',
      openStreetMaps: 'https://www.openstreetmap.org/relation/test',
    },
    population: 38000000,
    gini: {
      '2017': 33.3,
    },
    fifa: 'CAN',
    car: {
      signs: ['CDN'],
      side: 'right',
    },
    timezones: [
      'UTC-08:00',
      'UTC-07:00',
      'UTC-06:00',
      'UTC-05:00',
      'UTC-04:00',
      'UTC-03:30',
    ],
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/ca.png',
      svg: 'https://flagcdn.com/ca.svg',
      alt: 'The flag of Canada is composed of a red maple leaf centered on a white square, flanked by two red vertical bands.',
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/ca.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/ca.svg',
    },
    startOfWeek: 'sunday',
    capitalInfo: {
      latlng: [45.42, -75.7],
    },
    postalCode: {
      format: 'A#A #A#',
      regex:
        '^([ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJKLMNPRSTVWXYZ]) ?(\\d[ABCEGHJKLMNPRSTVWXYZ]\\d)$',
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup the mocked functions
    (load as jest.Mock).mockImplementation(mockLoad);
    (save as jest.Mock).mockImplementation(mockSave);

    set = jest.fn();
    get = jest.fn(() => mockAppState);
    store = {} as StoreApi<AppState>;

    favCountriesSlice = createFavCountriesSlice(set, get, store);
  });

  test('should initialize with default state', () => {
    // Check that the slice contains the initial state
    expect(favCountriesSlice.favCountriesList).toEqual([]);
  });

  describe('__fetchAllFavCountriesDetails', () => {
    test('should fetch favorite countries data successfully', async () => {
      const mockFavCountries = [mockCountry];

      mockLoad.mockResolvedValue(mockFavCountries);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(mockLoad).toHaveBeenCalledWith('FAV_COUNTRIES_LIST_KEY');
      expect(set).toHaveBeenCalledWith({
        favCountriesList: mockFavCountries,
      });
    });

    test('should handle null response from storage', async () => {
      mockLoad.mockResolvedValue(null);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(mockLoad).toHaveBeenCalledWith('FAV_COUNTRIES_LIST_KEY');
      expect(set).not.toHaveBeenCalled();
    });

    test('should handle promise rejection during load', async () => {
      const mockError = new Error('Storage Error');
      mockLoad.mockRejectedValue(mockError);

      await favCountriesSlice.__fetchAllFavCountriesDetails();

      expect(mockLoad).toHaveBeenCalledWith('FAV_COUNTRIES_LIST_KEY');
      expect(mockDevLogger).toHaveBeenCalledWith(
        'favCountryList __fetchAllFavCountriesDetails: Error processing fav countries list',
        mockError,
        'fail',
      );
      expect(set).not.toHaveBeenCalled();
    });
  });

  describe('__addCountryToFavorties', () => {
    test('should add country to favorites when lists exist', async () => {
      const existingNames = ['USA', 'UK'];
      const existingCountries = [mockCountry];

      mockLoad
        .mockResolvedValueOnce(existingNames) // First call for names
        .mockResolvedValueOnce(existingCountries); // Second call for countries

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(mockLoad).toHaveBeenCalledTimes(2);
      expect(mockLoad).toHaveBeenNthCalledWith(1, 'FAV_COUTRIES_NAME_LIST_KEY');
      expect(mockLoad).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY');

      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(mockSave).toHaveBeenNthCalledWith(
        1,
        'FAV_COUTRIES_NAME_LIST_KEY',
        [...existingNames, mockCountry.name.common],
      );
      expect(mockSave).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY', [
        ...existingCountries,
        mockCountry,
      ]);
    });

    test('should add country to favorites when lists are null', async () => {
      mockLoad
        .mockResolvedValueOnce(null) // First call for names
        .mockResolvedValueOnce(null); // Second call for countries

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(mockLoad).toHaveBeenCalledTimes(2);
      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(mockSave).toHaveBeenNthCalledWith(
        1,
        'FAV_COUTRIES_NAME_LIST_KEY',
        [mockCountry.name.common],
      );
      expect(mockSave).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY', [
        mockCountry,
      ]);
    });

    test('should handle error when adding country to favorites', async () => {
      const mockError = new Error('Storage Error');
      mockLoad.mockRejectedValue(mockError);

      await favCountriesSlice.__addCountryToFavorties(mockCountry);

      expect(mockDevLogger).toHaveBeenCalledWith(
        'favCountryList in __addCountryToFavorties',
        mockError,
        'fail',
      );
    });
  });

  describe('__removeCountryFromFavorties', () => {
    test('should remove country from favorites when lists exist', async () => {
      const existingNames = ['USA', 'Canada', 'UK'];
      const existingCountries = [
        {name: {common: 'USA'}},
        mockCountry,
        {name: {common: 'UK'}},
      ];

      mockLoad
        .mockResolvedValueOnce(existingNames) // First call for names
        .mockResolvedValueOnce(existingCountries); // Second call for countries

      await favCountriesSlice.__removeCountryFromFavorties('Canada');

      expect(mockLoad).toHaveBeenCalledTimes(2);
      expect(mockLoad).toHaveBeenNthCalledWith(1, 'FAV_COUTRIES_NAME_LIST_KEY');
      expect(mockLoad).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY');

      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(mockSave).toHaveBeenNthCalledWith(
        1,
        'FAV_COUTRIES_NAME_LIST_KEY',
        ['USA', 'UK'],
      );
      expect(mockSave).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY', [
        {name: {common: 'USA'}},
        {name: {common: 'UK'}},
      ]);
    });

    test('should handle null lists when removing country', async () => {
      mockLoad
        .mockResolvedValueOnce(null) // First call for names
        .mockResolvedValueOnce(null); // Second call for countries

      await favCountriesSlice.__removeCountryFromFavorties('Canada');

      expect(mockLoad).toHaveBeenCalledTimes(2);
      expect(mockSave).not.toHaveBeenCalled();
    });

    test('should handle error when removing country from favorites', async () => {
      const mockError = new Error('Storage Error');
      mockLoad.mockRejectedValue(mockError);

      await favCountriesSlice.__removeCountryFromFavorties('Canada');

      expect(mockDevLogger).toHaveBeenCalledWith(
        'favCountryList in __removeCountryFromFavorties',
        mockError,
        'fail',
      );
    });

    test('should remove only matching country name', async () => {
      const existingNames = ['USA', 'Canada', 'UK'];
      const existingCountries = [
        {name: {common: 'USA'}},
        {name: {common: 'Canada'}},
        {name: {common: 'UK'}},
      ];

      mockLoad
        .mockResolvedValueOnce(existingNames)
        .mockResolvedValueOnce(existingCountries);

      await favCountriesSlice.__removeCountryFromFavorties('USA');

      expect(mockSave).toHaveBeenNthCalledWith(
        1,
        'FAV_COUTRIES_NAME_LIST_KEY',
        ['Canada', 'UK'],
      );
      expect(mockSave).toHaveBeenNthCalledWith(2, 'FAV_COUNTRIES_LIST_KEY', [
        {name: {common: 'Canada'}},
        {name: {common: 'UK'}},
      ]);
    });
  });
});
