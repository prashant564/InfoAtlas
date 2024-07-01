import {ViewStyle} from 'react-native';
import {ThemeType} from '@themes/getTheme';
/**
 * All screen keyboard offsets.
 */
export const offsets = {
  none: 0,
  bigButton: 100,
  ios: 10,
};

/**
 * The variations of keyboard offsets.
 */
export type KeyboardOffsets = keyof typeof offsets;

export const presets = (theme: ThemeType) => {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  return {
    fixed: {
      outer: {
        backgroundColor: theme.colors.background,
        flex: 1,
        height: '100%',
      } as ViewStyle,
      inner: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        width: '100%',
      } as ViewStyle,
    },

    /**
     * Scrolls. Suitable for forms or other things requiring a keyboard.
     *
     * Pick this one if you don't know which one you want yet.
     */
    scroll: {
      outer: {
        backgroundColor: theme.colors.background,
        flex: 1,
        height: '100%',
      } as ViewStyle,
      inner: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      } as ViewStyle,
    },
  };
};

export const presetsType = {
  fixed: {
    outer: {
      backgroundColor: '#000000',
      flex: 1,
      height: '100%',
    } as ViewStyle,
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      height: '100%',
      width: '100%',
    } as ViewStyle,
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   *
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    outer: {
      backgroundColor: '#000000',
      flex: 1,
      height: '100%',
    } as ViewStyle,
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    } as ViewStyle,
  },
};

/**
 * The variations of screens.
 */
export type ScreenPresets = keyof typeof presetsType;

/**
 * Is this preset a non-scrolling one?
 *
 * @param preset The preset to check
 */
export function isNonScrolling(
  preset: ScreenPresets,
  theme: ThemeType,
): boolean {
  // any of these things will make you scroll

  return (
    preset === null ||
    !preset.length ||
    presets(theme)[preset] === null ||
    preset === 'fixed'
  );
}
