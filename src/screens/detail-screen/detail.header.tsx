import {Pressable, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {Icon, Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {DetailScreenStyles} from './styles';

export type DetailHeaderProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailHeader = ({selectedCountry}: DetailHeaderProps) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation();

  const {flag, name} = selectedCountry;

  const {rowItemContainer, headerContainer, headerTitle, headerSideSpacer} =
    DetailScreenStyles(theme);

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
        {/* Balances the back button so the title stays centred */}
        <View style={headerSideSpacer} />
      </View>
    </View>
  );
};

export default DetailHeader;
