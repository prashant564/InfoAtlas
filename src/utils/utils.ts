import {CurrencyItem} from '@services/api';

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

export const getCurrencyString = (currencies: {
  [key: string]: CurrencyItem;
}): string => {
  const currencyKeys = Object.keys(currencies);

  if (currencyKeys.length === 0) {
    return 'NaN';
  }

  const currencyKey = currencyKeys[0];
  const currency = currencies[currencyKey];

  return `${currency.symbol} ${currency.name}`;
};
