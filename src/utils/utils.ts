import {CurrencyItem} from '@services/api';

import {NOT_AVAILABLE} from './constants';

type Procedure = (...args: any[]) => void;

export const debounce = <F extends Procedure>(
  func: F,
  wait: number,
  immediate: boolean = false,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getCurrencyString = (currencies?: {
  [key: string]: CurrencyItem;
}): string =>
  joinOrNotAvailable(
    Object.values(currencies ?? {}).map(currency =>
      `${currency?.symbol || ''} ${currency?.name || ''}`.trim(),
    ),
  );

/**
 * Joins the non-empty values, or returns the "not available" placeholder.
 */
export const joinOrNotAvailable = (
  values?: (string | undefined | null)[],
  separator: string = ', ',
): string => {
  const present = (values ?? []).filter(
    (value): value is string => typeof value === 'string' && value !== '',
  );
  return present.length > 0 ? present.join(separator) : NOT_AVAILABLE;
};

export const formatYesNo = (value?: boolean): string =>
  value === undefined ? NOT_AVAILABLE : value ? 'Yes' : 'No';
