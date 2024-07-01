import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';

import {useAppTheme} from '@themes/getTheme';

import {DEFUALT_SIZE, IconSizePresets, iconSizePresets} from './icon.presets';

import {AvatarIconProps} from './typings';

const Icon = (props: AvatarIconProps) => {
  const {theme} = useAppTheme();
  const {icon, size, color = theme.appColors.primary200, style} = props;
  const iconSize = iconSizePresets[size as IconSizePresets] || DEFUALT_SIZE;
  const defaultContainerView = {
    backgroundColor: theme?.appColors.transparent,
  };
  const iconStyle = StyleSheet.flatten([defaultContainerView, style]);

  return (
    <Avatar.Icon size={iconSize} icon={icon} style={iconStyle} color={color} />
  );
};

export default Icon;
