import {View} from 'react-native';
import React, {useMemo} from 'react';
import {Divider} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {useAppBoundStore} from '@store/mainStore';
import {getCountriesByCode} from '@store/stores/countries';

import {formatYesNo, joinOrNotAvailable} from '@utils/utils';
import {NOT_AVAILABLE} from '@utils/constants';

import {DetailScreenStyles} from './styles';

export type DetailAdditionalInfoSectionProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailAdditionalInfoSection = ({
  selectedCountry,
}: DetailAdditionalInfoSectionProps) => {
  const {theme} = useAppTheme();

  const {borders, independent, unMember, fifa, landlocked, startOfWeek} =
    selectedCountry;

  const allCountryDetailsList = useAppBoundStore(
    state => state.allCountryDetailsList,
  );
  const countriesByCode = useMemo(
    () => getCountriesByCode(allCountryDetailsList),
    [allCountryDetailsList],
  );

  const groupedBordersString = joinOrNotAvailable(
    (borders ?? []).map(code => countriesByCode[code]?.name.common ?? code),
  );

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
          <Text variant={'bodyLarge'} children={formatYesNo(independent)} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'UN Member'}
            mt={8}
          />
          <Text variant={'bodyLarge'} children={formatYesNo(unMember)} />
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
          <Text variant={'bodyLarge'} children={fifa || NOT_AVAILABLE} />
        </View>
        <View style={leftAlignItemContainer}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Landlocked'}
            mt={16}
          />
          <Text variant={'bodyLarge'} children={formatYesNo(landlocked)} />
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
          <Text
            variant={'bodyLarge'}
            children={startOfWeek?.toUpperCase() || NOT_AVAILABLE}
          />
        </View>
      </View>
    </View>
  );
};

export default DetailAdditionalInfoSection;
