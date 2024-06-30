/**
 * types of all possible api related problems
 */
export type GeneralApiProblem =
  /**
   * Times up.
   */
  | {kind: 'timeout'; temporary: true}
  /**
   * Cannot connect to the server for some reason.
   */
  | {kind: 'cannot-connect'; temporary: true}
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | {kind: 'server'}
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | {kind: 'unauthorized'}
  /**
   * We don't have access to perform that request. This is 403.
   */
  | {kind: 'forbidden'}
  /**
   * Unable to find that resource.  This is a 404.
   */
  | {kind: 'not-found'}
  /**
   * All other 4xx series errors.
   */
  | {kind: 'rejected'}
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | {kind: 'unknown'; temporary: true}
  /**
   * The data we received is not in the expected format.
   */
  | {kind: 'bad-data'; data?: string};

/**
 * api wrappers types
 */
export type FetchRequestResponseItem<T> = {
  status: number;
  data?: T;
  msg?: string;
};

export type FetchRequestResponse<T> = FetchRequestResponseItem<T>[];

export type KeyValuePairs = Record<string, string | number>;

export type FetchResponse<T> =
  | {kind: 'ok'; data: FetchRequestResponse<T>}
  | GeneralApiProblem;

export type AllCountriesResponse =
  | {kind: 'ok'; data: CountryDetailsItem[]}
  | GeneralApiProblem;

export type CountryDetailsItem = {
  name: Name;
  tld?: string[];
  cca2?: string;
  ccn3?: string;
  cca3?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Currencies;
  idd?: Idd;
  capital?: string[];
  altSpellings?: string[];
  region?: string;
  subregion?: string;
  languages?: Languages;
  translations?: {[key: string]: Translation};
  latlng?: number[];
  landlocked?: boolean;
  area?: number;
  demonyms?: Demonyms;
  flag?: string;
  maps?: Maps;
  population?: number;
  car?: Car;
  timezones?: string[];
  continents?: string[];
  flags?: Flags;
  coatOfArms?: CoatOfArms;
  startOfWeek?: string;
  capitalInfo?: CapitalInfo;
  postalCode?: PostalCode;
  cioc?: string;
  gini?: {[key: string]: number};
  fifa?: string;
  borders?: string[];
};

export type CapitalInfo = {
  latlng?: number[];
};

export type Car = {
  signs?: string[];
  side?: string;
};

export type CoatOfArms = {
  png?: string;
  svg?: string;
};

export type Currencies = {
  XPF?: Eur;
  ISK?: Eur;
  EUR?: Eur;
};

export type Eur = {
  name?: string;
  symbol?: string;
};

export type Demonyms = {
  eng?: Eng;
  fra?: Eng;
};

export type Eng = {
  f?: string;
  m?: string;
};

export type Flags = {
  png?: string;
  svg?: string;
  alt?: string;
};

export type Idd = {
  root?: string;
  suffixes?: string[];
};

export type Languages = {
  fra?: string;
  isl?: string;
  deu?: string;
  ltz?: string;
};

export type Maps = {
  googleMaps?: string;
  openStreetMaps?: string;
};

export type Name = {
  common: string;
  official: string;
  nativeName: NativeName;
};

export type NativeName = {
  fra?: Translation;
  isl?: Translation;
  deu?: Translation;
  ltz?: Translation;
};

export type Translation = {
  official?: string;
  common?: string;
};

export type PostalCode = {
  format?: string;
  regex?: string;
};
