import React from 'react';
import {TextFieldProps} from './typings';
import {TextInput, HelperText} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '@themes/getTheme';

const TextFieldStyles = StyleSheet.create({
  wrapperStyle: {alignItems: 'flex-start', width: '100%'},
  containerStyle: {
    width: '100%',
  },
});

function TextField(props: TextFieldProps): React.ReactElement<TextFieldProps> {
  const {
    placeholder,
    label,
    error,
    style: containerStyleOverride = {},
    helperStyle: helperStyleOverride = {},
    wrapperStyle: wrapperStyleOverride = {},
    forwardedRef,
    value,
    onFocus,
    onEndEditing,
    onBlur,
    assistiveText,
    errorMsg,
    disabled,
    showHelper = false,
  } = props;
  const {theme} = useAppTheme();

  const {containerStyle, wrapperStyle} = TextFieldStyles;

  const labelText = label;
  const placeholderText = placeholder;
  const assistiveTextVal = assistiveText;
  const helperTextType = error ? 'error' : 'info';
  const helperTextStyle = StyleSheet.flatten([
    {
      color: disabled
        ? theme.appColors.primary400
        : helperTextType === 'error'
        ? theme.appColors.miscOrange
        : theme.appColors.primary20,
    },
    helperStyleOverride,
  ]);

  const activeOutlineColor = error
    ? theme.appColors.miscOrange
    : theme.colors.primary;

  const placeHolderTextColor =
    value !== '' && typeof value !== 'undefined'
      ? theme.colors.primary
      : theme.colors.placeholder;

  const surfaceVariantColor =
    value !== '' && typeof value !== 'undefined'
      ? theme.colors.activeBackground
      : theme.colors.placeholder;

  const labelColor =
    error && !disabled ? theme.appColors.miscOrange : theme.colors.text;

  const backgroundColor = {
    backgroundColor: theme.colors.textInputBg,
  };

  const textFieldStyle = StyleSheet.flatten([
    backgroundColor,
    containerStyle,
    containerStyleOverride,
  ]);

  const inputWrapperStyle = StyleSheet.flatten([
    wrapperStyle,
    wrapperStyleOverride,
  ]);

  return (
    <View style={inputWrapperStyle}>
      <TextInput
        {...props}
        mode="flat"
        label={labelText}
        placeholder={placeholderText}
        placeholderTextColor={placeHolderTextColor}
        style={textFieldStyle}
        activeOutlineColor={activeOutlineColor}
        activeUnderlineColor={theme.colors.activeBackground}
        underlineColor={theme.colors.inactiveBackground}
        textColor={theme.colors.text}
        autoCorrect={false}
        onEndEditing={onEndEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        theme={{
          colors: {
            background: theme.colors.textInputBg,
            placeholder: placeHolderTextColor,
            text: labelColor,
            onSurfaceVariant: surfaceVariantColor,
          },
        }}
        ref={forwardedRef}
      />
      {showHelper && (
        <HelperText
          type={helperTextType}
          visible={true}
          style={helperTextStyle}>
          {helperTextType === 'error' ? errorMsg : assistiveTextVal}
        </HelperText>
      )}
    </View>
  );
}

export default TextField;
