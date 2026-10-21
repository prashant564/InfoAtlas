import {Pressable, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {Theme, useThemeContext} from '@utils/ThemeContext';

import {SettingScreenStyles} from './styles';

const THEME_OPTIONS: {mode: Theme; label: string; icon: string}[] = [
  {mode: Theme.System, label: 'System', icon: 'cellphone'},
  {mode: Theme.Light, label: 'Light', icon: 'white-balance-sunny'},
  {mode: Theme.Dark, label: 'Dark', icon: 'weather-night'},
];

/** A segmented control: one tap, applies instantly, nothing to confirm. */
const SettingsThemePicker = () => {
  const {theme} = useAppTheme();
  const {themeMode, setThemeMode} = useThemeContext();
  const {
    segmentedPadding,
    segmentedTrack,
    segment,
    segmentSelected,
    segmentLabel,
  } = SettingScreenStyles(theme);

  return (
    <View style={segmentedPadding}>
      <View style={segmentedTrack} accessibilityRole={'radiogroup'}>
        {THEME_OPTIONS.map(({mode, label, icon}) => {
          const selected = themeMode === mode;
          const color = selected
            ? theme.colors.onPrimaryContainer
            : theme.colors.secondaryText;
          return (
            <Pressable
              key={mode}
              accessibilityRole={'radio'}
              accessibilityLabel={label}
              accessibilityState={{checked: selected}}
              onPress={() => setThemeMode(mode)}
              style={[segment, selected && segmentSelected]}>
              <MaterialCommunityIcons name={icon} size={20} color={color} />
              <Text
                variant={'labelMedium'}
                style={[segmentLabel, {color}]}
                children={label}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default SettingsThemePicker;
