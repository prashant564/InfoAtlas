import {View} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {formatNumberWithCommas} from '@utils/utils';

import {DetailScreenStyles} from './styles';

export type DetailAdditionalInfoSectionProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailAdditionalInfoSection = ({
  selectedCountry,
}: DetailAdditionalInfoSectionProps) => {
  const {theme} = useAppTheme();

  const {borders, independent, unMember, fifa, population, startOfWeek} =
    selectedCountry;

  const groupedBordersString =
    borders !== undefined ? borders.join(', ') : 'NaN';

  const {
    fullFlexContainer,
    rowItemContainer,
    leftAlignItemContainer,
    divider,
    bottomRowItemContainer,
  } = DetailScreenStyles(theme);

  return (
    <View style={fullFlexContainer}>
      <Text variant={'headlineSmall'} children={'Additional Details'} mt={16} />
      <Divider style={divider} bold />
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Independent'}
            mt={8}
          />
          <Text
            variant={'bodyLarge'}
            children={
              independent !== undefined ? (independent ? 'Yes' : 'No') : 'NaN'
            }
          />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'UN Member'}
            mt={8}
          />
          <Text variant={'bodyLarge'} children={unMember ? 'Yes' : 'No'} />
        </View>
      </View>
      <View style={rowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Fifa'}
            mt={16}
          />
          <Text
            variant={'bodyLarge'}
            children={fifa !== undefined ? fifa : 'NaN'}
          />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Landlocked'}
            mt={16}
          />
          <Text
            variant={'bodyLarge'}
            children={formatNumberWithCommas(population)}
          />
        </View>
      </View>
      <View style={bottomRowItemContainer}>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Borders'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={groupedBordersString} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Start of Week'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={startOfWeek?.toUpperCase()} />
        </View>
      </View>
    </View>
  );
};

export default DetailAdditionalInfoSection;
