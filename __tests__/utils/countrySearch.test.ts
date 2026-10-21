import {filterCountries, normalizeSearchText} from '@utils/countrySearch';
import {bundledDataset} from '@services/countries';

const names = (query: string) =>
  filterCountries(bundledDataset.countries, query).map(c => c.name.common);

describe('country search', () => {
  test('normalizes accents, case and punctuation', () => {
    expect(normalizeSearchText('  Åland ')).toBe('aland');
    expect(normalizeSearchText("Côte d'Ivoire")).toBe('cote d ivoire');
  });

  test('returns everything for an empty query', () => {
    expect(filterCountries(bundledDataset.countries, '  ')).toBe(
      bundledDataset.countries,
    );
  });

  test('matches accented names with plain letters and vice versa', () => {
    expect(names('aland')).toContain('Åland Islands');
    expect(names('sao tome')).toContain('São Tomé and Príncipe');
    expect(names('Curaçao')).toContain('Curaçao');
  });

  test('matches the start of any word in the name', () => {
    expect(names('korea')).toEqual(
      expect.arrayContaining(['North Korea', 'South Korea']),
    );
  });

  test('matches alternative spellings', () => {
    expect(names('usa')).toContain('United States');
  });

  test('lists common-name prefix matches first', () => {
    expect(names('ind')[0]).toMatch(/^Ind/);
  });

  test('returns nothing for gibberish', () => {
    expect(names('zzzz')).toEqual([]);
  });
});
