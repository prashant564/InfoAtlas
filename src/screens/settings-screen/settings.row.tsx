import {ActivityIndicator, Pressable, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {ROW_ICON_SIZE, SettingScreenStyles} from './styles';

export type SettingsRowTone = 'primary' | 'visited' | 'wishlist' | 'danger';

export type SettingsRowProps = {
  icon: string;
  title: string;
  subtitle?: string;
  /** Short status shown on the right, e.g. "Up to date". */
  value?: string;
  /** chevron: opens a screen; external: leaves the app. */
  trailing?: 'chevron' | 'external' | 'loading' | 'none';
  tone?: SettingsRowTone;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
  /** The last row in a section has no separator. */
  isLast?: boolean;
};

const TRAILING_ICON = {
  chevron: 'chevron-right',
  external: 'open-in-new',
};

const SettingsRow = ({
  icon,
  title,
  subtitle,
  value,
  trailing = 'none',
  tone = 'primary',
  onPress,
  disabled = false,
  accessibilityHint,
  isLast = false,
}: SettingsRowProps) => {
  const {theme} = useAppTheme();
  const {colors} = theme;
  const {
    row,
    rowIconTile,
    rowBody,
    rowSeparator,
    rowText,
    rowTrailing,
    rowValue,
  } = SettingScreenStyles(theme);

  const tones: Record<SettingsRowTone, {tile: string; icon: string}> = {
    primary: {tile: colors.primaryContainer, icon: colors.onPrimaryContainer},
    visited: {tile: colors.visitedContainer, icon: colors.onVisitedContainer},
    wishlist: {
      tile: colors.wishlistContainer,
      icon: colors.onWishlistContainer,
    },
    danger: {tile: colors.inactiveBackground, icon: colors.error},
  };
  const titleColor = tone === 'danger' ? colors.error : colors.text;

  const label = [title, subtitle, value].filter(Boolean).join(', ');

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled, busy: trailing === 'loading'}}
      disabled={disabled || !onPress}
      onPress={onPress}
      android_ripple={{color: colors.inactiveBackground}}
      style={({pressed}) => [
        row,
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: pressed ? colors.inactiveBackground : undefined,
        },
      ]}>
      <View style={[rowIconTile, {backgroundColor: tones[tone].tile}]}>
        <MaterialCommunityIcons
          name={icon}
          size={ROW_ICON_SIZE}
          color={tones[tone].icon}
        />
      </View>
      <View style={[rowBody, !isLast && rowSeparator]}>
        <View style={rowText}>
          <Text
            variant={'bodyLarge'}
            style={{color: titleColor}}
            children={title}
          />
          {subtitle && (
            <Text
              type={'secondary'}
              variant={'bodySmall'}
              children={subtitle}
            />
          )}
        </View>
        <View style={rowTrailing}>
          {value && (
            <Text
              type={'secondary'}
              variant={'bodyMedium'}
              style={rowValue}
              accessibilityLiveRegion={'polite'}
              children={value}
            />
          )}
          {trailing === 'loading' && (
            <ActivityIndicator size={'small'} color={colors.primary} />
          )}
          {(trailing === 'chevron' || trailing === 'external') && (
            <MaterialCommunityIcons
              name={TRAILING_ICON[trailing]}
              size={trailing === 'chevron' ? 22 : 18}
              color={colors.secondaryText}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default SettingsRow;
