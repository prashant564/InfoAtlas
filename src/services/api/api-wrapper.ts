import {ApiResponse, create} from 'apisauce';
import setCookie from 'set-cookie-parser';

import {load, save} from '@utils/storageUtils';

import {DEFAULT_API_CONFIG} from './api-config';
import {getGeneralApiProblem} from './api.problem';

import {FetchRequestResponse, FetchResponse, KeyValuePairs} from './api.types';

export const apiSauce = create({
  baseURL: DEFAULT_API_CONFIG.url,
  timeout: DEFAULT_API_CONFIG.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    'Cache-Control': 'no-store',
    Source: 'app_call',
  },
});

export const getFetch = async <T>(
  url: string,
  params?: KeyValuePairs,
  config?: any,
): Promise<FetchResponse<T>> => {
  try {
    const xsrfToken = await load('xsrf-token');

    if (xsrfToken) {
      apiSauce.setHeader('xsrf-token', xsrfToken);
    }
  } catch (error) {
    if (__DEV__) {
      console.log('xneep');
    }
  }

  const response: ApiResponse<FetchRequestResponse<T>> = await apiSauce.get(
    url,
    params,
    config,
  );
  // the typical ways to die when calling an api
  if (!response.ok) {
    const problem = getGeneralApiProblem(response);
    if (problem) {
      return problem;
    }
  }

  // transform the data into the format we are expecting
  if (response.data) {
    try {
      if (response.headers && 'set-cookie' in response.headers) {
        const splitCookieHeaders = setCookie.splitCookiesString(
          response.headers['set-cookie'][0],
        );
        const cookies = setCookie.parse(splitCookieHeaders);
        const xsrfToken = cookies.find(el => el.name === 'XSRF-TOKEN');

        if (xsrfToken) {
          await save('xsrf-token', xsrfToken.value);
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.log('xnoop');
      }
    }

    return {kind: 'ok', data: response.data};
  }

  return {kind: 'bad-data'};
};
