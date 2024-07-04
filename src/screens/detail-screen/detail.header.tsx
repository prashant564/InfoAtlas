/* eslint-disable react-hooks/exhaustive-deps */
import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {Icon, Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {load} from '@utils/storageUtils';
import {FAV_COUTRIES_NAME_LIST_KEY} from '@utils/constants';

import {useAppBoundStore} from '@store/mainStore';

import {DetailScreenStyles} from './styles';

export type DetailHeaderProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailHeader = ({selectedCountry}: DetailHeaderProps) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation();

  const [icon, setIcon] = useState('cards-heart-outline');
  const [isCountryFavorite, setIsCountryFavorite] = useState<boolean>(false);

  const {
    __addCountryToFavorties,
    __removeCountryFromFavorties,
    __fetchAllFavCountriesDetails,
  } = useAppBoundStore(state => ({
    __addCountryToFavorties: state.__addCountryToFavorties,
    __removeCountryFromFavorties: state.__removeCountryFromFavorties,
    __fetchAllFavCountriesDetails: state.__fetchAllFavCountriesDetails,
  }));

  const {flag, name} = selectedCountry;

  const {rowItemContainer, headerContainer, headerTitle} =
    DetailScreenStyles(theme);

  useEffect(() => {
    setIcon(isCountryFavorite ? 'cards-heart' : 'cards-heart-outline');
  }, [isCountryFavorite]);

  useEffect(() => {
    load(FAV_COUTRIES_NAME_LIST_KEY).then(async res => {
      if (res !== null) {
        if (res.includes(name.common)) {
          setIsCountryFavorite(true);
        }
      }
    });
  }, []);

  const removeFromFavorites = async () => {
    __removeCountryFromFavorties(name.common);
    __fetchAllFavCountriesDetails();
    setIsCountryFavorite(false);
    setIcon('cards-heart-outline');
  };

  const addToFavorties = async () => {
    __addCountryToFavorties(selectedCountry);
    __fetchAllFavCountriesDetails();
    setIsCountryFavorite(true);
    setIcon('cards-heart');
  };

  const handleAddOrRemoveFromFavPress = () => {
    if (isCountryFavorite) {
      removeFromFavorites();
    } else {
      addToFavorties();
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
