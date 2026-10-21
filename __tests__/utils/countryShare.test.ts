import {buildCountryShareMessage, getMapsUrl} from '@utils/countryShare';
import {bundledDataset} from '@services/countries';

const findCountry = (cca3: string) =>
  bundledDataset.countries.find(c => c.cca3 === cca3)!;

const JULY = new Date(Date.UTC(2026, 6, 15, 12, 7));

describe('country share', () => {
  test('getMapsUrl uses the platform maps app', () => {
    const country = findCountry('CIV');
    const query = encodeURIComponent(country.name.common);
    expect(getMapsUrl(country, 'ios')).toBe(
      `https://maps.apple.com/?q=${query}`,
    );
    expect(getMapsUrl(country, 'android')).toBe(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
    );
  });

  test('builds a readable card', () => {
    expect(buildCountryShareMessage(findCountry('IND'), JULY, null))
      .toMatchInlineSnapshot(`
      "🇮🇳 India
      Republic of India

      🏛 Capital: New Delhi
      👥 Population: 1.4B
      🗣 Languages: English, Hindi, Tamil
      💰 Currency: ₹ Indian rupee
      🕒 Local time: 5:37 PM (UTC+05:30)

      Shared from InfoAtlas"
    `);
  });

  test('skips the official name when it matches and appends the store link', () => {
    const message = buildCountryShareMessage(
      findCountry('CAN'),
      JULY,
      'https://example.com/app',
    );
    expect(message.split('\n')[1]).toBe('');
    expect(message).toMatch(
      /Explore every country with InfoAtlas: https:\/\/example.com\/app$/,
    );
  });
});
