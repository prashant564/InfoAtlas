import {getAllCountriesData} from '@services/api/api';
import {apiSauce} from '@services/api/api-wrapper';
import fallbackCountries from '@services/api/fallbackCountries.json';

jest.mock('@services/api/api-wrapper', () => ({
  apiSauce: {
    get: jest.fn(),
  },
}));

describe('getAllCountriesData API service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns remote countries data when API call succeeds with valid data', async () => {
    const mockRemoteData = [
      {
        name: {common: 'MockLand', official: 'Republic of MockLand', nativeName: {}},
        cca2: 'ML',
        cca3: 'MLD',
        unMember: true,
        currencies: {MLD: {name: 'Dollar', symbol: '$'}},
        capital: ['Mock City'],
        region: 'TestRegion',
        population: 1000000,
        flags: {png: 'https://example.com/ml.png'},
        flag: '🏳️',
        maps: {},
        car: {signs: ['ML'], side: 'right'},
        translations: {},
      },
    ];

    (apiSauce.get as jest.Mock).mockResolvedValueOnce({
      ok: true,
      data: mockRemoteData,
    });

    const res = await getAllCountriesData();
    expect(res.kind).toBe('ok');
    if (res.kind === 'ok') {
      expect(res.data).toEqual(mockRemoteData);
      expect(res.data).toHaveLength(1);
    }
  });

  test('falls back to bundled offline countries when API call fails with network/server error', async () => {
    (apiSauce.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      problem: 'TIMEOUT_ERROR',
      data: null,
    });

    const res = await getAllCountriesData();
    expect(res.kind).toBe('ok');
    if (res.kind === 'ok') {
      expect(res.data.length).toBe(fallbackCountries.length);
      expect(res.data.length).toBe(250);
      expect(res.data[0].name.common).toBeDefined();
    }
  });

  test('falls back to bundled offline countries when API throws an exception', async () => {
    (apiSauce.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const res = await getAllCountriesData();
    expect(res.kind).toBe('ok');
    if (res.kind === 'ok') {
      expect(res.data.length).toBe(250);
    }
  });

  test('falls back to bundled offline countries when API returns empty list', async () => {
    (apiSauce.get as jest.Mock).mockResolvedValueOnce({
      ok: true,
      data: [],
    });

    const res = await getAllCountriesData();
    expect(res.kind).toBe('ok');
    if (res.kind === 'ok') {
      expect(res.data.length).toBe(250);
    }
  });
});

