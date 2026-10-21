/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, FlatList} from 'react-native';

import {Translation} from '@services/api';
import {Text} from '@components';
import {Button, Surface} from 'react-native-paper';
import {DetailScreenStyles} from './styles';
import {useAppTheme} from '@themes';

export type DetailTranslationList = {
  translations: {[key: string]: Translation};
};

const DetailTranslationList = ({translations}: DetailTranslationList) => {
  const keys = Object.keys(translations);

  const {theme} = useAppTheme();
  const [selectedKey, setSelectedKey] = useState<string | null>(keys[0]);

  const renderItem = ({item}: {item: string}) => (
    <Button
      mode="contained"
      style={{
        backgroundColor:
          selectedKey === item
            ? theme.colors.activeBackground
            : theme.colors.inactiveBackground,
        margin: 2,
      }}
      onPress={() => setSelectedKey(item)}>
      <Text
        type={'secondary'}
        variant={'bodyMedium'}
        children={item.toUpperCase()}
      />
    </Button>
  );

  const {fullWidthContainer, sectionTitle, surface, flatListStyle} =
    DetailScreenStyles(theme);

  return (
    <View style={fullWidthContainer}>
      <Text
        variant={'titleLarge'}
        style={sectionTitle}
        children={'Translations'}
      />
      <FlatList
        data={keys}
        renderItem={renderItem}
        keyExtractor={item => item}
        horizontal
        style={flatListStyle}
      />
      {selectedKey && (
        <Surface elevation={2} style={surface}>
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Official'}
          />
          <Text
            variant={'bodyLarge'}
            children={translations[selectedKey].official}
          />
          <Text
            type={'secondary'}
            variant={'labelMedium'}
            children={'Common'}
            mt={16}
          />
          <Text
            variant={'bodyLarge'}
            children={translations[selectedKey].common}
          />
        </Surface>
      )}
    </View>
  );
};

export default DetailTranslationList;
