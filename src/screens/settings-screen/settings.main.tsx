import {View} from 'react-native';
import React from 'react';
import {Divider, Switch} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {Theme, useThemeContext} from '@utils/ThemeContext';

import {SettingScreenStyles} from './styles';

const SettingScreen = () => {
  const {theme} = useAppTheme();
  const {themeMode, setThemeMode} = useThemeContext();
  const {top} = useSafeAreaInsets();

  const {outerContainer, divider, rowContainer} = SettingScreenStyles(theme);

  return (
    <View style={[outerContainer, {top}]}>
      <Text variant={'headlineLarge'} children={'Settings'} />
      <Divider style={divider} bold />
      <View style={rowContainer}>
        <Text
          variant={'titleMedium'}
          children={`Current Theme: ${
            themeMode === Theme.Dark ? 'Dark' : 'Light'
          }`}
          style={{flex: 1}}
        />
        <Switch
          color={theme.appColors.confusedYellow}
          value={themeMode === Theme.Dark}
          onValueChange={toggled => {
            setThemeMode(toggled ? Theme.Dark : Theme.Light);
          }}
        />
      </View>
    </View>
  );
};

export default SettingScreen;
