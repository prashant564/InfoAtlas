import {View} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {formatNumberWithCommas, getCurrencyString} from '@utils/utils';

import {DetailScreenStyles} from './styles';

export type DetailGeneralInfoSectionProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailGeneralInfoSection = ({
  selectedCountry,
}: DetailGeneralInfoSectionProps) => {
  const {theme} = useAppTheme();

  const {
    name,
    capital,
    region,
    subregion,
    population,
    currencies,
    car,
    languages,
    timezones,
  } = selectedCountry;

  const allLanguagesString =
    languages !== undefined
      ? Object.keys(languages).join(', ').toUpperCase()
      : 'NaN';
  const currencyString = getCurrencyString(currencies);
  const groupedTimeZones = timezones?.join(' ');
  const carRules = `${car.signs[0]} - ${car.side}`;

  const {fullFlexContainer, rowItemContainer, leftAlignItemContainer, divider} =
    DetailScreenStyles(theme);

  return (
    <View style={fullFlexContainer}>
      <Text
        variant={'headlineSmall'}
        children={'General Information'}
        mt={16}
      />
      <Divider style={divider} bold />
      <Text variant={'titleMedium'} children={name.official} />
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Capital'}
            mt={8}
          />
          <Text
            variant={'bodyLarge'}
            children={capital !== undefined ? capital[0] : 'NaN'}
          />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Region'}
            mt={8}
          />
          <Text
            variant={'bodyLarge'}
            children={region !== undefined ? region : 'NaN'}
          />
        </View>
      </View>
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Subregion'}
            mt={16}
          />
          <Text
            variant={'bodyLarge'}
            children={subregion !== undefined ? subregion : 'NaN'}
          />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Population'}
            mt={16}
          />
          <Text
            variant={'bodyLarge'}
            children={formatNumberWithCommas(population)}
          />
        </View>
      </View>
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Languages'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={allLanguagesString} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Currencies'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={currencyString} />
        </View>
      </View>
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Car Rules'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={carRules} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'TimeZones'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={groupedTimeZones} />
        </View>
      </View>
    </View>
  );
};

export default DetailGeneralInfoSection;
