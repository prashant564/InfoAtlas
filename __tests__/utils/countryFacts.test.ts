import {
  capitalize,
  formatArea,
  formatCompactArea,
  formatCompactNumber,
  formatPopulationDensity,
  formatTimeAtOffset,
  formatUtcOffset,
  getCallingCode,
  getCurrentOffsets,
  getDemonym,
  getLatestGini,
  getLocalTime,
  getZoneOffsetMinutes,
  parseUtcOffset,
} from '@utils/countryFacts';
import {bundledDataset} from '@services/countries';
import {NOT_AVAILABLE} from '@utils/constants';

const findCountry = (cca3: string) =>
  bundledDataset.countries.find(c => c.cca3 === cca3)!;

const JANUARY = new Date(Date.UTC(2026, 0, 15, 12, 7));
const JULY = new Date(Date.UTC(2026, 6, 15, 12, 7));

describe('time zones', () => {
  test('parseUtcOffset', () => {
    expect(parseUtcOffset('UTC')).toBe(0);
    expect(parseUtcOffset('UTC+05:30')).toBe(330);
    expect(parseUtcOffset('UTC-03:00')).toBe(-180);
    expect(parseUtcOffset('UTC−09:30')).toBe(-570);
    expect(parseUtcOffset('GMT+1')).toBeNull();
  });

  test('formatUtcOffset', () => {
    expect(formatUtcOffset(0)).toBe('UTC');
    expect(formatUtcOffset(330)).toBe('UTC+05:30');
    expect(formatUtcOffset(-600)).toBe('UTC-10:00');
  });

  test('getZoneOffsetMinutes applies daylight saving', () => {
    expect(getZoneOffsetMinutes('Europe/London', JANUARY)).toBe(0);
    expect(getZoneOffsetMinutes('Europe/London', JULY)).toBe(60);
    expect(getZoneOffsetMinutes('Asia/Kolkata', JULY)).toBe(330);
  });

  test('getZoneOffsetMinutes returns null for unknown zones', () => {
    expect(getZoneOffsetMinutes('Mars/Olympus_Mons', JULY)).toBeNull();
  });

  test('formatTimeAtOffset uses a 12 hour clock', () => {
    expect(formatTimeAtOffset(JULY, 0)).toBe('12:07 PM');
    expect(formatTimeAtOffset(JULY, 330)).toBe('5:37 PM');
    expect(formatTimeAtOffset(JULY, -720)).toBe('12:07 AM');
  });

  test('UK local time follows British Summer Time', () => {
    expect(getLocalTime(findCountry('GBR'), JANUARY)).toEqual({
      time: '12:07 PM',
      detail: 'UTC',
    });
    expect(getLocalTime(findCountry('GBR'), JULY)).toEqual({
      time: '1:07 PM',
      detail: 'UTC+01:00',
    });
  });

  test('multi-zone countries show a range', () => {
    const local = getLocalTime(findCountry('USA'), JANUARY)!;
    expect(local.time).toBe('2:07 AM – 7:07 AM');
    expect(local.detail).toMatch(/time zones · UTC-10:00 to UTC-05:00$/);
  });

  test('falls back to fixed offsets without IANA ids', () => {
    const bouvet = findCountry('BVT');
    expect(bouvet.timezoneIds).toBeUndefined();
    expect(getCurrentOffsets(bouvet, JULY)).toEqual([60]);
  });

  test('every country has a local time', () => {
    const missing = bundledDataset.countries.filter(
      c => getLocalTime(c, JULY) === null,
    );
    expect(missing.map(c => c.name.common)).toEqual([]);
  });
});

describe('facts formatting', () => {
  test('getCallingCode', () => {
    expect(getCallingCode({root: '+9', suffixes: ['1']})).toBe('+91');
    expect(getCallingCode({root: '+1', suffixes: ['201', '202']})).toBe('+1');
    expect(getCallingCode({})).toBe(NOT_AVAILABLE);
  });

  test('area treats non-positive values as unknown', () => {
    expect(formatArea(3287263)).toBe('3,287,263 km²');
    expect(formatArea(-1)).toBe(NOT_AVAILABLE);
    expect(formatCompactArea(3287263)).toBe('3.3M km²');
  });

  test('formatPopulationDensity', () => {
    expect(formatPopulationDensity(1000000, 1000)).toBe('1,000 / km²');
    expect(formatPopulationDensity(56000, 2166086)).toBe('0.03 / km²');
    expect(formatPopulationDensity(500, 100)).toBe('5.0 / km²');
    expect(formatPopulationDensity(500, -1)).toBe(NOT_AVAILABLE);
  });

  test('formatCompactNumber', () => {
    expect(formatCompactNumber(1428627663)).toBe('1.4B');
    expect(formatCompactNumber(331000000)).toBe('331M');
    expect(formatCompactNumber(38250)).toBe('38.3K');
    expect(formatCompactNumber(2000)).toBe('2K');
    expect(formatCompactNumber(512)).toBe('512');
  });

  test('getDemonym', () => {
    expect(getDemonym({eng: {f: 'Indian', m: 'Indian'}})).toBe('Indian');
    expect(getDemonym({eng: {f: 'Française', m: 'French'}})).toBe(
      'French / Française',
    );
    expect(getDemonym(undefined)).toBe(NOT_AVAILABLE);
  });

  test('getLatestGini picks the most recent year', () => {
    expect(getLatestGini({'2011': 35.7, '2019': 32.8})).toBe('32.8 (2019)');
    expect(getLatestGini(undefined)).toBe(NOT_AVAILABLE);
  });

  test('capitalize', () => {
    expect(capitalize('monday')).toBe('Monday');
    expect(capitalize(undefined)).toBe(NOT_AVAILABLE);
  });
});
