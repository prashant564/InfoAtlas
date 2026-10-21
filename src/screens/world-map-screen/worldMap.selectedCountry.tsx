import {View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {Text} from '@components';

import {PrimaryParamList} from '@navigation';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import DetailTravelStatus from '@screens/detail-screen/detail.travelStatus';

import worldMapStyles from './styles';

export type WorldMapSelectedCountryProps = {
  country: CountryDetailsItem;
};

/** Mark the tapped country without leaving the map, or open its details. */
const WorldMapSelectedCountry = ({country}: WorldMapSelectedCountryProps) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation<NavigationProp<PrimaryParamList>>();
  const {selectedHeader, selectedFlag, selectedName, detailsButtonContent} =
    worldMapStyles(theme);

  return (
    <View>
      <View style={selectedHeader}>
        <Text style={selectedFlag} children={country.flag} />
        <View style={selectedName}>
          <Text
            variant={'titleMedium'}
            numberOfLines={1}
            children={country.name.common}
          />
          {!!(country.subregion || country.region) && (
            <Text
              type={'secondary'}
              variant={'bodySmall'}
              numberOfLines={1}
              children={country.subregion || country.region}
            />
          )}
        </View>
        <Button
          icon={'chevron-right'}
          contentStyle={detailsButtonContent}
          onPress={() =>
            navigation.navigate('DetailScreen', {selectedCountry: country})
          }>
          Details
        </Button>
      </View>
      <DetailTravelStatus selectedCountry={country} />
    </View>
  );
};

export default WorldMapSelectedCountry;
