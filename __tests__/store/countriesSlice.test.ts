import {
  createCountriesSlice,
  initialCountriesState,
} from '@store/stores/countries';
import {StoreApi} from 'zustand';
import {AppState} from '@store/mainStore';
import {CountryDetailsItem} from '@services/api';

// Mock dependencies
const mockGetAllCountriesData = jest.fn();
const mockDevLogger = jest.fn();

// Set up mocks
jest.mock('@services/api', () => ({
  getAllCountriesData: () => mockGetAllCountriesData(),
}));

jest.mock('@utils/logger', () => ({
  devLogger: (...args: any[]) => mockDevLogger(...args),
}));

describe('Countries Slice', () => {
  let set: jest.Mock;
  let get: jest.Mock;
  let store: StoreApi<AppState>;
  let countriesSlice: any;

  const mockAppState = {
    ...initialCountriesState,
    __fetchAllCountriesDetails: jest.fn(),
  } as any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    set = jest.fn();
    get = jest.fn(() => mockAppState);
    store = {} as StoreApi<AppState>;

    countriesSlice = createCountriesSlice(set, get, store);
  });

  test('should initialize with default state', () => {
    // Check that the slice contains the initial state
    expect(countriesSlice.allCountryDetailsList).toEqual([]);
  });

  test('should fetch countries data successfully', async () => {
    // Mock API response
    const mockCountries: CountryDetailsItem[] = [
      {
        name: {
          common: 'Botswana',
          official: 'Republic of Botswana',
          nativeName: {},
        },
        tld: ['.bw'],
        cca2: 'BW',
        ccn3: '072',
        cioc: 'BOT',
        independent: true,
        status: 'officially-assigned',
        unMember: true,
        currencies: {
          BWP: {
            symbol: 'P',
            name: 'Botswana pula',
          },
        },
        idd: {
          root: '+2',
          suffixes: ['67'],
        },
        capital: ['Gaborone'],
        altSpellings: ['BW', 'Republic of Botswana', 'Lefatshe la Botswana'],
        region: 'Africa',
        subregion: 'Southern Africa',
        languages: {
          eng: 'English',
          tsn: 'Tswana',
        },
        latlng: [-22, 24],
        landlocked: true,
        borders: ['NAM', 'ZAF', 'ZMB', 'ZWE'],
        area: 582000,
        demonyms: {
          eng: {
            f: 'Motswana',
            m: 'Motswana',
          },
          fra: {
            f: 'Botswanaise',
            m: 'Botswanais',
          },
        },
        cca3: 'BWA',
        translations: {
          ara: {
            official: 'جمهورية بوتسوانا',
            common: 'بوتسوانا',
          },
          bre: {
            official: 'Republik Botswana',
            common: 'Botswana',
          },
          ces: {
            official: 'Botswanská republika',
            common: 'Botswana',
          },
          cym: {
            official: 'Republic of Botswana',
            common: 'Botswana',
          },
          deu: {
            official: 'Republik Botsuana',
            common: 'Botswana',
          },
          est: {
            official: 'Botswana Vabariik',
            common: 'Botswana',
          },
          fin: {
            official: 'Botswanan tasavalta',
            common: 'Botswana',
          },
          fra: {
            official: 'République du Botswana',
            common: 'Botswana',
          },
          hrv: {
            official: 'Republika Bocvana',
            common: 'Bocvana',
          },
          hun: {
            official: 'Botswanai Köztársaság',
            common: 'Botswana',
          },
          ind: {
            official: 'Republik Botswana',
            common: 'Botswana',
          },
          ita: {
            official: 'Repubblica del Botswana',
            common: 'Botswana',
          },
          jpn: {
            official: 'ボツワナ共和国',
            common: 'ボツワナ',
          },
          kor: {
            official: '보츠와나 공화국',
            common: '보츠와나',
          },
          nld: {
            official: 'Republiek Botswana',
            common: 'Botswana',
          },
          per: {
            official: 'جمهوری بوتسوانا',
            common: 'بوتسوانا',
          },
          pol: {
            official: 'Republika Botswany',
            common: 'Botswana',
          },
          por: {
            official: 'República do Botswana',
            common: 'Botswana',
          },
          rus: {
            official: 'Республика Ботсвана',
            common: 'Ботсвана',
          },
          slk: {
            official: 'Botswanská republika',
            common: 'Botswana',
          },
          spa: {
            official: 'República de Botswana',
            common: 'Botswana',
          },
          srp: {
            official: 'Република Боцвана',
            common: 'Боцвана',
          },
          swe: {
            official: 'Republiken Botswana',
            common: 'Botswana',
          },
          tur: {
            official: 'Botsvana Cumhuriyeti',
            common: 'Botsvana',
          },
          urd: {
            official: 'جمہوریہ بوٹسوانا',
            common: 'بوٹسوانا',
          },
          zho: {
            official: '博茨瓦纳共和国',
            common: '博茨瓦纳',
          },
        },
        flag: '🇧🇼',
        maps: {
          googleMaps: 'https://goo.gl/maps/E364KeLy6N4JwxwQ8',
          openStreetMaps: 'https://www.openstreetmap.org/relation/1889339',
        },
        population: 2351625,
        gini: {
          '2015': 53.3,
        },
        fifa: 'BOT',
        car: {
          signs: ['BW'],
          side: 'left',
        },
        timezones: ['UTC+02:00'],
        continents: ['Africa'],
        flags: {
          png: 'https://flagcdn.com/w320/bw.png',
          svg: 'https://flagcdn.com/bw.svg',
          alt: 'The flag of Botswana has a light blue field with a white-edged black horizontal band across its center.',
        },
        coatOfArms: {
          png: 'https://mainfacts.com/media/images/coats_of_arms/bw.png',
          svg: 'https://mainfacts.com/media/images/coats_of_arms/bw.svg',
        },
        startOfWeek: 'monday',
        capitalInfo: {
          latlng: [-24.63, 25.9],
        },
        postalCode: {
          format: 'good',
          regex: '1w31',
        },
      },
    ];

    mockGetAllCountriesData.mockResolvedValue({
      kind: 'ok',
      data: mockCountries,
    });

    await countriesSlice.__fetchAllCountriesDetails();
    expect(mockGetAllCountriesData).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({
      allCountryDetailsList: mockCountries,
    });
  });

  test('should handle empty data response', async () => {
    // Mock API response with empty data
    mockGetAllCountriesData.mockResolvedValue({
      kind: 'ok',
      data: null,
    });

    await countriesSlice.__fetchAllCountriesDetails();
    expect(mockGetAllCountriesData).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({
      allCountryDetailsList: [],
    });
  });

  test('should handle error when fetching countries data', async () => {
    // Mock API error
    const mockError = new Error('API Error');
    mockGetAllCountriesData.mockRejectedValue(mockError);
    await countriesSlice.__fetchAllCountriesDetails();
    expect(mockGetAllCountriesData).toHaveBeenCalledTimes(1);
    expect(mockDevLogger).toHaveBeenCalledWith(
      'getAllCountriesData in __fetchAllCountriesDetails',
      mockError,
      'fail',
    );

    expect(set).not.toHaveBeenCalled();
  });

  test('should handle non-ok response', async () => {
    mockGetAllCountriesData.mockResolvedValue({
      kind: 'error',
    });

    await countriesSlice.__fetchAllCountriesDetails();
    expect(mockGetAllCountriesData).toHaveBeenCalledTimes(1);
    expect(set).not.toHaveBeenCalled();
  });
});
