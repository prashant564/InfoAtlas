import {Platform, TextStyle} from 'react-native';

export const colors = {
  /**
   * colors
   */
  goodblue: '#1e88e5',
  /* theme */
  white: '#ffffff',
  pitchBlack: '#000000',
  violet: '#4f4677',
  primary: '#401A63',
  primary10: '#edcfff',
  primary20: '#E4CFFF',
  primary100: '#8708D7',
  primaryDark100: '#BD54FF',
  primary200: '#6000B1',
  primary300: '#4C0081',
  primary400: '#401A63',
  primary500: '#360457',
  primary600: '#2E004C',
  lightPrimary: '#efe2ff',
  secondary100: '#1ABC9C',
  secondary200: '#16A085',
  miscYellow: '#FFC300',
  miscBrown: '#D77C11',
  miscOrange: '#E74C3C',
  miscMagenta: '#E600D2',
  oldPurple: '#E5E2F3',
  grey100: '#FAFAFB',
  grey200: '#F6F7F8',
  grey300: '#E7EAED',
  grey400: '#CFD4DE',
  grey500: '#C1C8D3',
  grey600: '#949EB0',
  grey700: '#808A9B',
  grey800: '#5A667A',
  grey900: '#263550',
  disabledGrey: '#BDBDBD',
  darkThemeGrey100: '#5A565F',
  darkThemeGrey700: '#1A1420',
  darkThemeGrey900: '#212121',
  darkThemeAppGrey900: '#080110',

  lavender: 'rgb(217, 212, 237)',
  darkSalmon: 'rgb(244, 151, 124)',
  lightSeaGreen: 'rgb(26, 188, 156)',
  deepPeach: 'rgb(254, 209, 162)',
  charcoal: 'rgb(43, 37, 73)',
  darkSlateBlue: 'rgb(87, 75, 144)',
  snowWhite: 'rgb(249, 249, 249)',
  pastelRed: 'rgb(192, 57, 43)',
  jungleGreen: 'rgb(22, 160, 133)',
  darkGreen: '#00a74d',
  lightGray2: 'rgb(164, 164, 164)',
  sunsetOrange: 'rgb(255, 230, 200)',
  redOrangified: 'rgb(231, 76, 60)', // carmine pink
  redLighter: 'rgb(255, 87, 70)',
  darkRed: '#e4011f',
  confusedYellow: 'rgb(239, 159, 34)',

  transparent: 'rgba(0, 0, 0, 0)',
  black__a1: 'rgba(0, 0, 0, 0.1)',
  black__a2: 'rgba(0, 0, 0, 0.2)',
  black__a3: 'rgba(0, 0, 0, 0.3)',
  black__a4: 'rgba(0, 0, 0, 0.4)',
  black__a5: 'rgba(0, 0, 0, 0.5)',
  black__a6: 'rgba(0, 0, 0, 0.6)',
  black__a7: 'rgba(0, 0, 0, 0.7)',
  black__a8: 'rgba(0, 0, 0, 0.8)',
  black__a9: 'rgba(0, 0, 0, 0.9)',

  white__a1: 'rgba(255, 255, 255, 0.1)',
  white__a2: 'rgba(255, 255, 255, 0.2)',
  white__a3: 'rgba(255, 255, 255, 0.3)',
  white__a4: 'rgba(255, 255, 255, 0.4)',
  white__a5: 'rgba(255, 255, 255, 0.5)',
  white__a6: 'rgba(255, 255, 255, 0.6)',
  white__a7: 'rgba(255, 255, 255, 0.7)',
  white__a8: 'rgba(255, 255, 255, 0.8)',
  white__a9: 'rgba(255, 255, 255, 0.9)',
};

const randomColors = [
  '#263550',
  '#1ABC9C',
  '#4AB6F2',
  '#4ACAF2',
  '#6D7BFA',
  '#76CE99',
  '#804AF2',
  '#88B8D3',
  '#98CD62',
  '#ACADAE',
  '#AD6EDE',
  '#CCBC2B',
  '#D9936B',
  '#E49494',
  '#E771AA',
  '#FB7E7E',
];

export const SCREEN_MARGIN = 16;

export const fontFamily: Record<
  'light' | 'regular' | 'medium' | 'bold',
  TextStyle
> = {
  light: {
    fontFamily: Platform.select({
      ios: 'Inter-Light',
      android: 'Inter-Light', // The file name
    }),
    fontWeight: Platform.select({
      ios: '300',
      android: undefined,
    }),
  },
  regular: {
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'Inter-Regular', // The file name
    }),
    fontWeight: Platform.select({
      ios: '400',
      android: undefined,
    }),
  },
  medium: {
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium', // The file name
    }),
    fontWeight: Platform.select({
      ios: '500',
      android: undefined,
    }),
  },
  bold: {
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'Inter-Bold', // The file name
    }),
    fontWeight: Platform.select({
      ios: '700',
      android: undefined,
    }),
  },
};

export type FontTypes = keyof typeof fontFamily;

export const spacing = {
  px: 1,
  '0': 0, // 0
  '1': 2.5, // 1
  '2': 5, // 2
  '3': 7.5, // 3
  '4': 10, // 4
  '5': 12.5, // 5
  '6': 15, // 6
  '8': 20, // 7
  '10': 25, // 8
  '12': 30, // 9
  '14': 35,
  '16': 40, // 10
  '20': 50, // 11
  '24': 60, // 12
  '32': 80, // 13
  '40': 100, // 14
  '48': 120, // 15
  '56': 140, // 16
  '64': 160, // 17

  '-1': -2.5, // -1
  '-2': -5, // -2
  '-3': -7.5, // -3
  '-4': -10, // -4
  '-5': -12.5, // -5
  '-6': -15, // -6
  '-8': -20, // -7
  '-10': -25, // -8
  '-12': -30, // -9
  '-16': -40, // -10
  '-20': -50, // -11
  '-24': -60, // -12
  '-32': -80, // -13
  '-40': -100, // -14
  '-48': -120, // -15
  '-56': -140, // -16
  '-64': -160, // -17
};

export const theme = {
  colors,
  fontFamily,
  spacing,
  randomColors,
};
