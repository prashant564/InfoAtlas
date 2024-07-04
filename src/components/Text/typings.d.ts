import {ReactNode} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {KeyPrefix, Namespace, UseTranslationOptions} from 'react-i18next';
import {FontSizes} from '@themes/theme-main';

export interface TextNewProps {
  /**
   * Children components.
   */
  children?: ReactNode;

  type?: 'primary' | 'secondary';
  /**
   * Text which is looked up via i18n.
   */
  tx?: KeyPrefix;
  /**
   * Namespace of the text which is looked up via i18n.
   */
  ns?: Namespace;
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: UseTranslationOptions<any>;

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;

  /**
   * An optional style override useful for padding & margin.
   */
  fontSize?: number | FontSizes;
  /**
   * An optional style override for marginTop
   */
  mt?: number;
  /**
   * An optional style override for marginBottom
   */
  mb?: number;
}
