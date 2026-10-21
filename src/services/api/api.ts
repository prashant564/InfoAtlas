import {apiSauce} from './api-wrapper';
import {getGeneralApiProblem} from './api.problem';
import {
  CountriesDatasetResponse,
  DataManifest,
  DataManifestResponse,
} from './api.types';

/**
 * Small file describing the latest published dataset. Fetched on every
 * launch to decide whether the full dataset needs downloading.
 */
export const getDataManifest = async (): Promise<DataManifestResponse> => {
  try {
    const response = await apiSauce.get<DataManifest>(
      'manifest.json',
      undefined,
      {timeout: 4000},
    );

    if (response.ok && typeof response.data?.version === 'number') {
      return {kind: 'ok', data: response.data};
    }

    return getGeneralApiProblem(response) || {kind: 'bad-data'};
  } catch (error) {
    return {kind: 'unknown', temporary: true};
  }
};

/**
 * The full countries dataset. The payload is returned as-is and must be
 * validated by the caller before use.
 */
export const getCountriesDataset =
  async (): Promise<CountriesDatasetResponse> => {
    try {
      const response = await apiSauce.get<unknown>(
        'countries.json',
        undefined,
        {timeout: 15000},
      );

      if (response.ok && response.data) {
        return {kind: 'ok', data: response.data};
      }

      return getGeneralApiProblem(response) || {kind: 'bad-data'};
    } catch (error) {
      return {kind: 'unknown', temporary: true};
    }
  };
