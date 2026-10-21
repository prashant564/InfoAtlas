import {View} from 'react-native';
import React from 'react';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {SettingScreenStyles} from './styles';

export type SettingsSectionProps = {
  title: string;
  /** Explains the section, under the card. */
  footer?: string;
  children: React.ReactNode;
};

/** A titled group of rows on a rounded card. */
const SettingsSection = ({title, footer, children}: SettingsSectionProps) => {
  const {theme} = useAppTheme();
  const {sectionTitle, sectionCard, sectionFooter} = SettingScreenStyles(theme);

  return (
    <View>
      <Text
        type={'secondary'}
        variant={'labelLarge'}
        accessibilityRole={'header'}
        style={sectionTitle}
        children={title}
      />
      <View style={sectionCard}>{children}</View>
      {footer && (
        <Text
          type={'secondary'}
          variant={'bodySmall'}
          style={sectionFooter}
          children={footer}
        />
      )}
    </View>
  );
};

export default SettingsSection;
