import {ThemeType} from '@themes/getTheme';

export const EmptyUIViewStyles = (theme: ThemeType) => {
  return {
    mainContainer: {
      flex: 1,
      padding: 16,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
    msgText: {
      fontWeight: '500' as '500',
      lineHeight: 16,
      textAlign: 'center' as 'center',
      color: theme.appColors.white__a7,
    },
  };
};
