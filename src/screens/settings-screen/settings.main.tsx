import {Linking, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ChoiceButton, Text} from '@components';

import {useAppTheme} from '@themes';

import {Theme, useThemeContext} from '@utils/ThemeContext';

import {SettingScreenStyles} from './styles';

const THEME_OPTIONS: {mode: Theme; label: string; icon: string}[] = [
  {mode: Theme.System, label: 'System', icon: 'theme-light-dark'},
  {mode: Theme.Light, label: 'Light', icon: 'white-balance-sunny'},
  {mode: Theme.Dark, label: 'Dark', icon: 'weather-night'},
];

const SettingScreen = () => {
  const {theme} = useAppTheme();
  const {themeMode, setThemeMode} = useThemeContext();
  const {top} = useSafeAreaInsets();

  const {
    outerContainer,
    divider,
    section,
    sectionHeader,
    optionsRow,
    optionButton,
    linkText,
  } = SettingScreenStyles(theme);

  const openTermsOfService = () => {
    Linking.openURL(
      'https://doc-hosting.flycricket.io/infoatlas-terms-of-use/5b574c8e-c9aa-4674-9ed1-65f1d1491c28/terms',
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(
      'https://doc-hosting.flycricket.io/infoatlas-privacy-policy/4d26526e-75d4-46f6-9e1f-bfead8dea22d/privacy',
    );
  };

  return (
    <View style={[outerContainer, {top}]}>
      <Text variant={'headlineLarge'} children={'Settings'} />
      <Divider style={divider} />
      <View style={section}>
        <Text style={sectionHeader}>APPEARANCE</Text>
        <View style={optionsRow}>
          {THEME_OPTIONS.map(({mode, label, icon}) => (
            <ChoiceButton
              key={mode}
              label={label}
              icon={icon}
              selected={themeMode === mode}
              style={optionButton}
              onPress={() => setThemeMode(mode)}
            />
          ))}
        </View>
      </View>
      <Divider style={divider} />
      <View style={section}>
        <Text style={sectionHeader}>APPLICATION</Text>
        <TouchableOpacity onPress={openTermsOfService}>
          <Text style={linkText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openPrivacyPolicy}>
          <Text style={linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
