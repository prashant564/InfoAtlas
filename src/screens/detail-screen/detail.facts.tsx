import {View} from 'react-native';
import React from 'react';
import {Surface} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {
  capitalize,
  formatArea,
  formatPopulationDensity,
  getCallingCode,
  getDemonym,
  getLatestGini,
} from '@utils/countryFacts';
import {
  formatNumberWithCommas,
  formatYesNo,
  getCurrencyString,
  joinOrNotAvailable,
} from '@utils/utils';
import {NOT_AVAILABLE} from '@utils/constants';

import {DetailScreenStyles} from './styles';

export type Fact = {
  label: string;
  value: string;
};

export type FactsSectionProps = {
  title: string;
  facts: Fact[];
};

export const FactsSection = ({title, facts}: FactsSectionProps) => {
  const {theme} = useAppTheme();
  const {sectionTitle, factsCard, factCell} = DetailScreenStyles(theme);

  return (
    <View>
      <Text variant={'titleLarge'} style={sectionTitle} children={title} />
      <Surface elevation={2} style={factsCard}>
        {facts.map(({label, value}) => (
          <View key={label} style={factCell}>
            <Text type={'secondary'} variant={'labelMedium'} children={label} />
            <Text variant={'bodyLarge'} children={value} />
          </View>
        ))}
      </Surface>
    </View>
  );
};

export const getFactSections = (
  country: CountryDetailsItem,
): FactsSectionProps[] => {
  const {
    population,
    area,
    demonyms,
    languages,
    region,
    subregion,
    landlocked,
    continents,
    currencies,
    gini,
    independent,
    unMember,
    idd,
    tld,
    car,
    startOfWeek,
    fifa,
  } = country;

  return [
    {
      title: 'People',
      facts: [
        {label: 'Population', value: formatNumberWithCommas(population)},
        {label: 'Density', value: formatPopulationDensity(population, area)},
        {label: 'Demonym', value: getDemonym(demonyms)},
        {
          label: 'Languages',
          value: joinOrNotAvailable(Object.values(languages ?? {})),
        },
      ],
    },
    {
      title: 'Geography',
      facts: [
        {label: 'Area', value: formatArea(area)},
        {label: 'Landlocked', value: formatYesNo(landlocked)},
        {label: 'Continent', value: joinOrNotAvailable(continents)},
        {
          label: 'Region',
          value: joinOrNotAvailable([region, subregion], ' · '),
        },
      ],
    },
    {
      title: 'Economy & Status',
      facts: [
        {label: 'Currencies', value: getCurrencyString(currencies)},
        {label: 'Inequality (Gini)', value: getLatestGini(gini)},
        {label: 'Independent', value: formatYesNo(independent)},
        {label: 'UN Member', value: formatYesNo(unMember)},
      ],
    },
    {
      title: 'Practical',
      facts: [
        {label: 'Calling Code', value: getCallingCode(idd)},
        {label: 'Internet Domain', value: joinOrNotAvailable(tld)},
        {label: 'Drives On', value: capitalize(car?.side)},
        {label: 'Week Starts', value: capitalize(startOfWeek)},
        {label: 'FIFA Code', value: fifa || NOT_AVAILABLE},
      ],
    },
  ];
};

export type DetailFactsProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailFacts = ({selectedCountry}: DetailFactsProps) => (
  <View>
    {getFactSections(selectedCountry).map(section => (
      <FactsSection key={section.title} {...section} />
    ))}
  </View>
);

export default DetailFacts;
