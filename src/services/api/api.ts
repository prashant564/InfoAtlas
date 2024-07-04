import {ApiResponse} from 'apisauce';

import {apiSauce} from './api-wrapper';
import {AllCountriesResponse, CountryDetailsItem} from './api.types';
import {getGeneralApiProblem} from './api.problem';

export const getAllCountriesData = async (
  config?: any,
): Promise<AllCountriesResponse> => {
  const response: ApiResponse<CountryDetailsItem[]> = await apiSauce.get(
    '/v3.1/all',
    undefined,
    config,
  );

  if (!response.ok) {
    const problem = getGeneralApiProblem(response);
    if (problem) {
      return problem;
    }
  }

  if (response.data) {
    return {kind: 'ok', data: response.data};
  }

  return {kind: 'bad-data'};
};
