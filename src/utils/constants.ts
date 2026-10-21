/**
 * The app's own countries dataset, served by jsDelivr straight from the
 * `data/` folder on the main branch of this repo.
 */
export const API_URL =
  'https://cdn.jsdelivr.net/gh/prashant564/InfoAtlas@main/data/';

/**
 * Public store listing appended to shared country cards. Leave null until
 * the listing is live (the Play URL for com.levelscountrylistapp 404s).
 */
export const STORE_URL: string | null = null;

export const DEFAULT_SPACING = 16;

export const NOT_AVAILABLE = '—';

export const COUNTRIES_DATASET_KEY = 'countriesDataset';

export const TRAVEL_ENTRIES_KEY = 'travelEntries';

/**
 * Legacy favourites keys, read once to migrate favourites into the wishlist:
 * FAV_COUNTRY_CODES_KEY (v1.2), the two below (<= v1.1.0).
 */
export const FAV_COUNTRY_CODES_KEY = 'favCountryCodes';

export const FAV_COUNTRIES_LIST_KEY = 'favCountryList';

export const FAV_COUTRIES_NAME_LIST_KEY = 'favNameList';

export const THEME_MODE_KEY = 'themeMode';

export const DUMMY_SKELETON_ARRAY = Array.from(
  {length: 12},
  (_, index) => index + 1,
);
