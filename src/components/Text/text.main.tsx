import React from 'react';
import {Text as BaseText} from 'react-native-paper';
import {StyleSheet} from 'react-native';

import {useAppTheme} from '@themes/getTheme';

import {TextNewProps} from './typings';

export type TextProps = TextNewProps &
  Omit<React.ComponentProps<typeof BaseText>, 'children'>;

const Text = ({
  text,
  children,
  type = 'primary',
  style: styleOverride = {},
  mt,
  mb,
  ...rest
}: TextProps) => {
  const {theme} = useAppTheme();
  const content = text || children;

  const letterSpacingPreset = {
    letterSpacing: 0,
  };

  const textColorPreset = {
    color: type === 'primary' ? theme.colors.text : theme.colors.secondaryText,
  };

  const marginTopPresets = mt !== undefined ? {marginTop: mt} : {};
  const marginBottomPresets = mb !== undefined ? {marginBottom: mt} : {};

  const textStyle = StyleSheet.flatten([
    textColorPreset,
    letterSpacingPreset,
    marginTopPresets,
    marginBottomPresets,
    styleOverride,
  ]);

  return (
    <BaseText {...rest} style={textStyle}>
      {content}
    </BaseText>
  );
};

export default Text;
