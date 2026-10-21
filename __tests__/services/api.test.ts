import {getCountriesDataset, getDataManifest} from '@services/api/api';
import {apiSauce} from '@services/api/api-wrapper';

jest.mock('@services/api/api-wrapper', () => ({
  apiSauce: {
    get: jest.fn(),
  },
}));

const mockGet = apiSauce.get as jest.Mock;

describe('dataset API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDataManifest', () => {
    test('returns the manifest when the response is valid', async () => {
      const manifest = {version: 3, updatedAt: '2026-10-21', count: 250};
      mockGet.mockResolvedValueOnce({ok: true, data: manifest});

      const res = await getDataManifest();

      expect(mockGet).toHaveBeenCalledWith('manifest.json', undefined, {
        timeout: 4000,
      });
      expect(res).toEqual({kind: 'ok', data: manifest});
    });

    test('returns bad-data when the manifest has no version', async () => {
      mockGet.mockResolvedValueOnce({ok: true, data: {success: false}});

      expect(await getDataManifest()).toEqual({kind: 'bad-data'});
    });

    test('maps network problems', async () => {
      mockGet.mockResolvedValueOnce({ok: false, problem: 'TIMEOUT_ERROR'});

      expect(await getDataManifest()).toEqual({
        kind: 'timeout',
        temporary: true,
      });
    });

    test('handles thrown errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'));

      expect(await getDataManifest()).toEqual({
        kind: 'unknown',
        temporary: true,
      });
    });
  });

  describe('getCountriesDataset', () => {
    test('returns the raw payload on success', async () => {
      const payload = {version: 3, countries: []};
      mockGet.mockResolvedValueOnce({ok: true, data: payload});

      const res = await getCountriesDataset();

      expect(mockGet).toHaveBeenCalledWith('countries.json', undefined, {
        timeout: 15000,
      });
      expect(res).toEqual({kind: 'ok', data: payload});
    });

    test('maps 404s', async () => {
      mockGet.mockResolvedValueOnce({
        ok: false,
        problem: 'CLIENT_ERROR',
        status: 404,
      });

      expect(await getCountriesDataset()).toEqual({kind: 'not-found'});
    });
  });
});
