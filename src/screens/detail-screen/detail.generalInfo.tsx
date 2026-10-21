import {View} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {
  formatNumberWithCommas,
  getCurrencyString,
  joinOrNotAvailable,
} from '@utils/utils';
import {NOT_AVAILABLE} from '@utils/constants';

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

  const capitalString = joinOrNotAvailable(capital);
  const allLanguagesString = joinOrNotAvailable(Object.values(languages ?? {}));
  const currencyString = getCurrencyString(currencies);
  const groupedTimeZones = joinOrNotAvailable(timezones);
  const carRules = car?.signs?.length
    ? `${car.signs[0]} - ${car.side}`
    : car?.side || NOT_AVAILABLE;

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
          <Text variant={'bodyLarge'} children={capitalString} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Region'}
            mt={8}
          />
          <Text variant={'bodyLarge'} children={region || NOT_AVAILABLE} />
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
          <Text variant={'bodyLarge'} children={subregion || NOT_AVAILABLE} />
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
