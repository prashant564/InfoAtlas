import {formatYesNo, getCurrencyString, joinOrNotAvailable} from '@utils/utils';
import {NOT_AVAILABLE} from '@utils/constants';

describe('utils', () => {
  test('getCurrencyString lists every currency', () => {
    expect(
      getCurrencyString({
        CHF: {name: 'Swiss franc', symbol: 'Fr.'},
        EUR: {name: 'Euro', symbol: '€'},
      }),
    ).toBe('Fr. Swiss franc, € Euro');
  });

  test('getCurrencyString falls back when there are none', () => {
    expect(getCurrencyString(undefined)).toBe(NOT_AVAILABLE);
    expect(getCurrencyString({})).toBe(NOT_AVAILABLE);
  });

  test('joinOrNotAvailable skips empty values', () => {
    expect(joinOrNotAvailable(['a', '', undefined, 'b'])).toBe('a, b');
    expect(joinOrNotAvailable([])).toBe(NOT_AVAILABLE);
  });

  test('formatYesNo', () => {
    expect(formatYesNo(true)).toBe('Yes');
    expect(formatYesNo(false)).toBe('No');
    expect(formatYesNo(undefined)).toBe(NOT_AVAILABLE);
  });
});
