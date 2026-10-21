import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {Image, Text} from '@components';

import {PrimaryParamList} from '@navigation';

import {CountryDetailsItem} from '@services/api';

import homePageStyles from './styles';
import {useAppTheme} from '@themes';

export type CountryListItem = {
  item: CountryDetailsItem;
};

const CountryListItem = ({item}: CountryListItem) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation<NavigationProp<PrimaryParamList>>();
  const {pressable, countryNameText, flagEmojiText} = homePageStyles(theme);

  // Tracked per URI (not a boolean) because FlashList recycles this
  // component for other countries.
  const flagUri = item.flags?.png || '';
  const [failedFlagUri, setFailedFlagUri] = useState<string | null>(null);
  const showEmojiFlag = flagUri === '' || failedFlagUri === flagUri;

  return (
    <Pressable
      style={({pressed}) => [
        pressable,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={() => {
        navigation.navigate('DetailScreen', {
          selectedCountry: item,
        });
      }}>
      {showEmojiFlag ? (
        <Text style={flagEmojiText}>{item.flag}</Text>
      ) : (
        <Image
          source={{uri: flagUri}}
          size={'lg'}
          onError={() => setFailedFlagUri(flagUri)}
        />
      )}
      <Text variant="bodyMedium" style={countryNameText} numberOfLines={2}>
        {item.name.common}
      </Text>
    </Pressable>
  );
};

export default CountryListItem;
