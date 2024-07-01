import React, {ForwardedRef} from 'react';
import {KeyPrefix, Namespace} from 'react-i18next';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {TextInput as PaperTextInput} from 'react-native-paper';

export interface TextFieldProps
  extends React.ComponentProps<typeof PaperTextInput> {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: KeyPrefix;
  /**
   * Namespace of the text which is looked up via i18n.
   */
  ns?: Namespace;
  /**
   * The label i18n key.
   */
  labelTx?: KeyPrefix;
  /**
   * Optional wrapper container style overrides useful for margins & padding.
   */
  style?: ViewStyle | ViewStyle[];
  /**
   * Optional input container style overrides for changing background color.
   */
  wrapperStyle?: ViewStyle | ViewStyle[];

  /**
   * Optional parameter that receives the ref of the input.
   */
  forwardedRef?: ForwardedRef;

  /**
   * Assistive text for the text field
   */
  assistiveText?: string;
  /**
   * Assistive text for the text field (translatable)
   */
  assistiveTx?: KeyPrefix;
  /**
   * Optional text for error message
   */
  errorMsg?: string;
  /**
   * Optional helperText style for displaying assistive and error message
   */
  helperStyle?: StyleProp<TextStyle>;
  /**
   * Optional value to show helper text or not
   */
  showHelper?: boolean;
}
