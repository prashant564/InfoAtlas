import {Pressable, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {Icon, Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {useAppBoundStore} from '@store/mainStore';

import {DetailScreenStyles} from './styles';

export type DetailHeaderProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailHeader = ({selectedCountry}: DetailHeaderProps) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation();

  const {flag, name, cca3} = selectedCountry;

  const {
    isCountryFavorite,
    __addCountryToFavorties,
    __removeCountryFromFavorties,
  } = useAppBoundStore(state => ({
    isCountryFavorite: state.favCountryCodes.includes(cca3),
    __addCountryToFavorties: state.__addCountryToFavorties,
    __removeCountryFromFavorties: state.__removeCountryFromFavorties,
  }));

  const icon = isCountryFavorite ? 'cards-heart' : 'cards-heart-outline';

  const {rowItemContainer, headerContainer, headerTitle} =
    DetailScreenStyles(theme);

  const handleAddOrRemoveFromFavPress = () => {
    if (isCountryFavorite) {
      __removeCountryFromFavorties(cca3);
    } else {
      __addCountryToFavorties(selectedCountry);
    }
  };

  return (
    <View style={headerContainer}>
      <View style={rowItemContainer}>
        <Pressable
          style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            icon={'arrow-left'}
            color={theme.colors.inactiveText}
            size="md"
          />
        </Pressable>
        <Text
          variant={'titleMedium'}
          style={headerTitle}
          children={`${flag} ${name.common}`}
          numberOfLines={1}
        />
        <Pressable
          style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
          onPress={handleAddOrRemoveFromFavPress}>
          <Icon icon={icon} color={theme.colors.inactiveText} size="md" />
        </Pressable>
      </View>
    </View>
  );
};

export default DetailHeader;
