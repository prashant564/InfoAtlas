import {Platform} from 'react-native';

import {CountryDetailsItem} from '@services/api';

import {NOT_AVAILABLE, STORE_URL} from './constants';
import {formatCompactNumber, getLocalTime} from './countryFacts';
import {getCurrencyString, joinOrNotAvailable} from './utils';

/**
 * Opens the platform maps app (Apple Maps / Google Maps) searching for the
 * country. The dataset's goo.gl short links are not used: Google is
 * retiring goo.gl.
 */
export const getMapsUrl = (
  country: CountryDetailsItem,
  os: typeof Platform.OS = Platform.OS,
): string => {
  const query = encodeURIComponent(country.name.common);
  return os === 'ios'
    ? `https://maps.apple.com/?q=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Plain-text card for the system share sheet.
 */
export const buildCountryShareMessage = (
  country: CountryDetailsItem,
  date: Date,
  storeUrl: string | null = STORE_URL,
): string => {
  const {flag, name, capital, population, languages, currencies} = country;
  const localTime = getLocalTime(country, date);

  const lines = [
    `${flag} ${name.common}`,
    name.official !== name.common ? name.official : null,
    '',
    `🏛 Capital: ${joinOrNotAvailable(capital)}`,
    `👥 Population: ${formatCompactNumber(population)}`,
    `🗣 Languages: ${joinOrNotAvailable(Object.values(languages ?? {}))}`,
    `💰 Currency: ${getCurrencyString(currencies)}`,
    `🕒 Local time: ${
      localTime ? `${localTime.time} (${localTime.detail})` : NOT_AVAILABLE
    }`,
    '',
    storeUrl
      ? `Explore every country with InfoAtlas: ${storeUrl}`
      : 'Shared from InfoAtlas',
  ];

  return lines.filter(line => line !== null).join('\n');
};
