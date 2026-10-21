import {Pressable, View} from 'react-native';
import React, {useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text} from '@components';

import {PrimaryParamList} from '@navigation';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {useAppBoundStore} from '@store/mainStore';
import {getCountriesByCode} from '@store/stores/countries';

import {DetailScreenStyles} from './styles';

export type DetailBordersProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailBorders = ({selectedCountry}: DetailBordersProps) => {
  const {theme} = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<PrimaryParamList>>();

  const allCountryDetailsList = useAppBoundStore(
    state => state.allCountryDetailsList,
  );

  const neighbours = useMemo(() => {
    const countriesByCode = getCountriesByCode(allCountryDetailsList);
    return (selectedCountry.borders ?? [])
      .map(code => countriesByCode[code])
      .filter((country): country is CountryDetailsItem => !!country);
  }, [allCountryDetailsList, selectedCountry.borders]);

  const {sectionTitle, pillRow, pill} = DetailScreenStyles(theme);

  return (
    <View>
      <Text variant={'titleLarge'} style={sectionTitle} children={'Borders'} />
      {neighbours.length === 0 ? (
        <Text
          type={'secondary'}
          variant={'bodyLarge'}
          children={'No land borders'}
        />
      ) : (
        <View style={pillRow}>
          {neighbours.map(neighbour => (
            <Pressable
              key={neighbour.cca3}
              accessibilityRole={'button'}
              style={({pressed}) => [pill, {opacity: pressed ? 0.5 : 1}]}
              onPress={() =>
                navigation.push('DetailScreen', {selectedCountry: neighbour})
              }>
              <Text
                variant={'labelLarge'}
                children={`${neighbour.flag} ${neighbour.name.common}`}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default DetailBorders;
