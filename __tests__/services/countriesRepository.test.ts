import {
  bundledDataset,
  checkForCountriesUpdate,
  fetchNewerCountries,
  isValidDataset,
  loadLocalCountries,
} from '@services/countries';
import {getCountriesDataset, getDataManifest} from '@services/api';
import {load, save} from '@utils/storageUtils';

import manifest from '../../data/manifest.json';

jest.mock('@services/api', () => ({
  getDataManifest: jest.fn(),
  getCountriesDataset: jest.fn(),
}));

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
}));

const mockManifest = getDataManifest as jest.Mock;
const mockDataset = getCountriesDataset as jest.Mock;
const mockLoad = load as jest.Mock;
const mockSave = save as jest.Mock;

const datasetWithVersion = (version: number) => ({
  ...bundledDataset,
  version,
});

describe('countries repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bundled dataset', () => {
    test('is valid and matches the manifest', () => {
      expect(isValidDataset(bundledDataset)).toBe(true);
      expect(bundledDataset.version).toBe(manifest.version);
      expect(bundledDataset.countries).toHaveLength(manifest.count);
    });

    test('has unique cca3 codes', () => {
      const codes = bundledDataset.countries.map(c => c.cca3);
      expect(new Set(codes).size).toBe(codes.length);
    });
  });

  describe('isValidDataset', () => {
    test('rejects truncated or malformed payloads', () => {
      expect(isValidDataset(null)).toBe(false);
      expect(isValidDataset({version: 2, countries: []})).toBe(false);
      expect(
        isValidDataset({
          ...bundledDataset,
          countries: [...bundledDataset.countries, {name: {}}],
        }),
      ).toBe(false);
      expect(isValidDataset({...bundledDataset, version: '2'})).toBe(false);
    });
  });

  describe('loadLocalCountries', () => {
    test('uses the bundled dataset when nothing is cached', async () => {
      mockLoad.mockResolvedValueOnce(null);

      const res = await loadLocalCountries();

      expect(res.version).toBe(bundledDataset.version);
      expect(res.countries).toHaveLength(bundledDataset.countries.length);
    });

    test('sorts countries by common name', async () => {
      mockLoad.mockResolvedValueOnce(null);

      const names = (await loadLocalCountries()).countries.map(
        c => c.name.common,
      );

      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    test('prefers a newer cached dataset', async () => {
      const cached = datasetWithVersion(bundledDataset.version + 1);
      mockLoad.mockResolvedValueOnce(cached);

      expect((await loadLocalCountries()).version).toBe(cached.version);
    });

    test('ignores a cache older than the bundle (e.g. after an app update)', async () => {
      mockLoad.mockResolvedValueOnce(
        datasetWithVersion(bundledDataset.version - 1),
      );

      expect((await loadLocalCountries()).version).toBe(bundledDataset.version);
    });

    test('ignores a corrupt cache', async () => {
      mockLoad.mockResolvedValueOnce({version: 99, countries: 'oops'});

      expect((await loadLocalCountries()).version).toBe(bundledDataset.version);
    });
  });

  describe('fetchNewerCountries', () => {
    test('does not download when the manifest is not newer', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 1}});

      expect(await fetchNewerCountries(1)).toBeNull();
      expect(mockDataset).not.toHaveBeenCalled();
    });

    test('returns null when the manifest request fails', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'cannot-connect'});

      expect(await fetchNewerCountries(1)).toBeNull();
      expect(mockDataset).not.toHaveBeenCalled();
    });

    test('downloads, caches and returns a newer dataset', async () => {
      const remote = datasetWithVersion(2);
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 2}});
      mockDataset.mockResolvedValueOnce({kind: 'ok', data: remote});

      const res = await fetchNewerCountries(1);

      expect(res?.version).toBe(2);
      expect(mockSave).toHaveBeenCalledWith('countriesDataset', remote);
    });

    test('rejects an invalid download without caching it', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 2}});
      mockDataset.mockResolvedValueOnce({
        kind: 'ok',
        data: {version: 2, countries: []},
      });

      expect(await fetchNewerCountries(1)).toBeNull();
      expect(mockSave).not.toHaveBeenCalled();
    });

    test('rejects a stale download served behind a newer manifest', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 2}});
      mockDataset.mockResolvedValueOnce({
        kind: 'ok',
        data: datasetWithVersion(1),
      });

      expect(await fetchNewerCountries(1)).toBeNull();
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe('checkForCountriesUpdate', () => {
    test('tells "up to date" apart from a failed check', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 1}});
      expect(await checkForCountriesUpdate(1)).toEqual({kind: 'up-to-date'});

      mockManifest.mockResolvedValueOnce({kind: 'cannot-connect'});
      expect(await checkForCountriesUpdate(1)).toEqual({kind: 'failed'});

      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 2}});
      mockDataset.mockResolvedValueOnce({kind: 'bad-data'});
      expect(await checkForCountriesUpdate(1)).toEqual({kind: 'failed'});
    });

    test('returns the newer dataset', async () => {
      mockManifest.mockResolvedValueOnce({kind: 'ok', data: {version: 2}});
      mockDataset.mockResolvedValueOnce({
        kind: 'ok',
        data: datasetWithVersion(2),
      });

      const result = await checkForCountriesUpdate(1);
      expect(result.kind).toBe('updated');
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
});
