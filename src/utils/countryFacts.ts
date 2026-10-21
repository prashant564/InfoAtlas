import {CountryDetailsItem, Demonyms, Idd} from '@services/api';

import {NOT_AVAILABLE} from './constants';
import {formatNumberWithCommas} from './utils';

/**
 * "UTC+05:30" -> 330, "UTC" -> 0. Returns null for anything else.
 */
export const parseUtcOffset = (timezone: string): number | null => {
  if (timezone === 'UTC') {
    return 0;
  }
  const match = /^UTC([+\-−])(\d{2}):(\d{2})$/.exec(timezone);
  if (!match) {
    return null;
  }
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '+' ? minutes : -minutes;
};

export const formatUtcOffset = (offsetMinutes: number): string => {
  if (offsetMinutes === 0) {
    return 'UTC';
  }
  const sign = offsetMinutes > 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${minutes}`;
};

const zoneFormatters = new Map<string, Intl.DateTimeFormat>();

/**
 * Offset of an IANA zone at `date`, including daylight saving.
 * Returns null if the JS engine can't resolve the zone.
 */
export const getZoneOffsetMinutes = (
  timeZone: string,
  date: Date,
): number | null => {
  try {
    let formatter = zoneFormatters.get(timeZone);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
      zoneFormatters.set(timeZone, formatter);
    }

    const parts: Record<string, number> = {};
    formatter.formatToParts(date).forEach(({type, value}) => {
      parts[type] = Number(value);
    });

    const zonedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour % 24,
      parts.minute,
    );
    const utcToTheMinute = Math.floor(date.getTime() / 60000) * 60000;
    const offset = Math.round((zonedAsUtc - utcToTheMinute) / 60000);

    return Number.isFinite(offset) ? offset : null;
  } catch {
    return null;
  }
};

/**
 * Distinct UTC offsets in use across the country right now, ascending.
 * Uses IANA zones (DST-aware) when available, else the fixed offsets.
 */
export const getCurrentOffsets = (
  country: CountryDetailsItem,
  date: Date,
): number[] => {
  const fromZones = (country.timezoneIds ?? [])
    .map(zone => getZoneOffsetMinutes(zone, date))
    .filter((offset): offset is number => offset !== null);

  const offsets =
    fromZones.length > 0
      ? fromZones
      : (country.timezones ?? [])
          .map(parseUtcOffset)
          .filter((offset): offset is number => offset !== null);

  return [...new Set(offsets)].sort((a, b) => a - b);
};

/**
 * Wall-clock time at a UTC offset, e.g. "3:07 PM".
 */
export const formatTimeAtOffset = (date: Date, offsetMinutes: number) => {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  const hours24 = shifted.getUTCHours();
  const minutes = String(shifted.getUTCMinutes()).padStart(2, '0');
  const period = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes} ${period}`;
};

export type LocalTime = {
  time: string;
  detail: string;
};

/**
 * "3:07 PM" for single-offset countries, "10:07 AM – 3:07 PM" otherwise.
 */
export const getLocalTime = (
  country: CountryDetailsItem,
  date: Date,
): LocalTime | null => {
  const offsets = getCurrentOffsets(country, date);
  if (offsets.length === 0) {
    return null;
  }

  const first = offsets[0];
  const last = offsets[offsets.length - 1];

  if (offsets.length === 1) {
    return {
      time: formatTimeAtOffset(date, first),
      detail: formatUtcOffset(first),
    };
  }

  return {
    time: `${formatTimeAtOffset(date, first)} – ${formatTimeAtOffset(
      date,
      last,
    )}`,
    detail: `${offsets.length} time zones · ${formatUtcOffset(
      first,
    )} to ${formatUtcOffset(last)}`,
  };
};

/**
 * "+91" for India. Countries sharing a root with many area codes
 * (e.g. +1 for the US) just show the root.
 */
export const getCallingCode = (idd?: Idd): string => {
  if (!idd?.root) {
    return NOT_AVAILABLE;
  }
  const suffixes = idd.suffixes ?? [];
  return suffixes.length === 1 ? `${idd.root}${suffixes[0]}` : idd.root;
};

// The dataset uses negative areas as "unknown".
const hasArea = (area?: number): area is number =>
  typeof area === 'number' && area > 0;

export const formatArea = (area?: number): string =>
  hasArea(area)
    ? `${formatNumberWithCommas(Math.round(area))} km²`
    : NOT_AVAILABLE;

export const formatPopulationDensity = (
  population: number,
  area?: number,
): string => {
  if (!hasArea(area)) {
    return NOT_AVAILABLE;
  }
  const density = population / area;
  const value =
    density < 1
      ? density.toFixed(2)
      : density < 10
      ? density.toFixed(1)
      : formatNumberWithCommas(Math.round(density));
  return `${value} / km²`;
};

/**
 * 1_428_627_663 -> "1.4B", 38_250 -> "38.3K", 512 -> "512".
 */
export const formatCompactNumber = (value: number): string => {
  const units: [number, string][] = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ];
  for (const [size, suffix] of units) {
    if (Math.abs(value) >= size) {
      const scaled = value / size;
      const rounded = scaled >= 100 ? Math.round(scaled) : scaled.toFixed(1);
      return `${String(rounded).replace(/\.0$/, '')}${suffix}`;
    }
  }
  return String(value);
};

export const formatCompactArea = (area?: number): string =>
  hasArea(area)
    ? `${formatCompactNumber(Math.round(area))} km²`
    : NOT_AVAILABLE;

export const getDemonym = (demonyms?: Demonyms): string => {
  const {f, m} = demonyms?.eng ?? {};
  if (m && f && m !== f) {
    return `${m} / ${f}`;
  }
  return m || f || NOT_AVAILABLE;
};

/**
 * Most recent Gini index, e.g. "35.7 (2011)".
 */
export const getLatestGini = (gini?: {[year: string]: number}): string => {
  const years = Object.keys(gini ?? {}).sort();
  const latest = years[years.length - 1];
  return latest ? `${gini![latest]} (${latest})` : NOT_AVAILABLE;
};

export const capitalize = (text?: string): string =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : NOT_AVAILABLE;
