import {useMemo, useState} from 'react';

import {CountryDetailsItem} from '@services/api';

import {debounce} from './utils';

/**
 * Lowercases and strips accents / punctuation so "Åland" matches "aland"
 * and "Côte" matches "cote".
 */
export const normalizeSearchText = (text: string): string => {
  const decomposed =
    typeof text.normalize === 'function' ? text.normalize('NFD') : text;
  return decomposed
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const matchesWordPrefix = (text: string, query: string): boolean => {
  const normalized = normalizeSearchText(text);
  return (
    normalized.startsWith(query) ||
    normalized.split(' ').some(word => word.startsWith(query))
  );
};

/**
 * Matches the start of any word in the common / official name or an
 * alternative spelling ("korea" -> South Korea, "usa" -> United States).
 * Countries whose common name starts with the query are listed first.
 */
export const filterCountries = (
  countries: CountryDetailsItem[],
  query: string,
): CountryDetailsItem[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery === '') {
    return countries;
  }

  const primary: CountryDetailsItem[] = [];
  const secondary: CountryDetailsItem[] = [];

  countries.forEach(country => {
    const {common, official} = country.name;
    if (normalizeSearchText(common).startsWith(normalizedQuery)) {
      primary.push(country);
    } else if (
      [common, official, ...(country.altSpellings ?? [])].some(text =>
        matchesWordPrefix(text, normalizedQuery),
      )
    ) {
      secondary.push(country);
    }
  });

  return [...primary, ...secondary];
};

export const useCountrySearch = (countries: CountryDetailsItem[]) => {
  const [query, setQuery] = useState('');

  const onChangeSearch = useMemo(() => debounce(setQuery, 250), []);

  const clearSearch = () => {
    // Overrides any pending debounced update as well.
    onChangeSearch('');
    setQuery('');
  };

  const results = useMemo(
    () => filterCountries(countries, query),
    [countries, query],
  );

  return {query, results, onChangeSearch, clearSearch};
};
