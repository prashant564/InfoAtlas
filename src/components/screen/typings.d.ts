import {ReactNode} from 'react';
import {ColorValue, ViewStyle} from 'react-native';

import {KeyboardOffsets, ScreenPresets} from './screen.presets';

export interface ScrollingScreenStoreProps {}

export interface NonScrollingScreenStoreProps {}

export interface ScreenProps {
  /**
   * Children components.
   */
  children?: ReactNode;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;

  /**
   * An optional style override useful for padding & margin.
   */
  scrollViewContainerStyles?: ViewStyle;

  /**
   * One of the different types of presets.
   */
  preset?: ScreenPresets;

  /**
   * An optional background color
   */
  backgroundColor?: string;

  /**
   * An optional status bar setting. Defaultss dark-content.
   */
  statusBar?: 'light-content' | 'dark-content';

  /**
   * An optional status bar setting. Defaults to dark-content.
   */
  statusBarBg?: ColorValue;

  /**
   * Should we not wrap in SafeAreaView? Defaults to false.
   */
  unsafe?: boolean;

  /**
   * By how much should we offset the keyboard? Defaults to none.
   */
  keyboardOffset?: KeyboardOffsets;
  hidden?: boolean;
  /**
   * has Pull To Refresh
   */
  hasPTR?: boolean;
  /**
   * add functions to call for Pull to refresh
   * Use this ony when preset = `scroll`
   */
  onPTR?: () => void;
  /**
   * disable default pull to refresh
   */
  disableDefaultPTR?: boolean;
}
