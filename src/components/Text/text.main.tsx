import React from 'react';
import {Text as BaseText} from 'react-native-paper';
import {StyleSheet, TextProps as RNTextProps} from 'react-native';

import {useAppTheme} from '@themes/getTheme';

import {TextNewProps} from './typings';

export type TextProps = TextNewProps &
  Omit<RNTextProps, 'children'> & {
    variant?: any;
    theme?: any;
  };

const BaseTextComponent = BaseText as unknown as React.ComponentType<any>;

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
  const marginBottomPresets = mb !== undefined ? {marginBottom: mb} : {};

  const textStyle = StyleSheet.flatten([
    textColorPreset,
    letterSpacingPreset,
    marginTopPresets,
    marginBottomPresets,
    styleOverride,
  ]);

  return (
    <BaseTextComponent {...rest} style={textStyle}>
      {content}
    </BaseTextComponent>
  );
};

export default Text;
