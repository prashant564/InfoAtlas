import {ApiResponse} from 'apisauce';

import {apiSauce} from './api-wrapper';
import {AllCountriesResponse, CountryDetailsItem} from './api.types';
import fallbackCountries from './fallbackCountries.json';

export const getAllCountriesData = async (
  config?: any,
): Promise<AllCountriesResponse> => {
  try {
    const response: ApiResponse<CountryDetailsItem[]> = await apiSauce.get(
      '/v3.1/all',
      undefined,
      {
        timeout: 4000,
        ...config,
      },
    );

    if (
      response.ok &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return {kind: 'ok', data: response.data};
    }
  } catch (error) {
    // remote fetch failed, use fallback
  }

  // Gracefully fallback to bundled offline dataset
  return {
    kind: 'ok',
    data: fallbackCountries as unknown as CountryDetailsItem[],
  };
};
