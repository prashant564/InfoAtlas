import React from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppTheme} from '@themes/getTheme';

import Text from '../Text/text.main';

export type ChoiceButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
  /** Defaults to the primary colour. */
  selectedColors?: {background: string; text: string};
  style?: StyleProp<ViewStyle>;
};

/**
 * A button that is one choice in a group (tabs, theme picker, status).
 * Unlike Paper's Button it exposes the selected state to screen readers.
 */
const ChoiceButton = ({
  label,
  selected,
  onPress,
  icon,
  selectedColors,
  style,
}: ChoiceButtonProps) => {
  const {theme} = useAppTheme();

  const backgroundColor = selected
    ? selectedColors?.background ?? theme.colors.activeBackground
    : theme.colors.inactiveBackground;
  const textColor = selected
    ? selectedColors?.text ?? theme.colors.activeText
    : theme.colors.text;

  return (
    <Pressable
      accessibilityRole={'button'}
      accessibilityState={{selected}}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {backgroundColor, opacity: pressed ? 0.8 : 1},
        style,
      ]}>
      {icon && (
        <MaterialCommunityIcons name={icon} size={18} color={textColor} />
      )}
      <Text
        variant={'labelLarge'}
        numberOfLines={1}
        style={[
          styles.label,
          icon ? styles.labelWithIcon : null,
          {color: textColor},
        ]}
        children={label}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
  },
  label: {
    flexShrink: 1,
  },
  labelWithIcon: {
    marginLeft: 6,
  },
});

export default ChoiceButton;
