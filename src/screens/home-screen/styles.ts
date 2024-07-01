import {ThemeType} from '@themes';
import {DEFAULT_SPACING} from '@utils/constants';
import {windowWidth} from '@utils/dimens';

const homePageStyles = (theme: ThemeType) => {
  return {
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      paddingBottom: 0,
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center' as 'center',
    },
    animatedViewConatainer: {
      flex: 1,
      width: '100%' as '100%',
      alignItems: 'center' as 'center',
    },
    surface: {
      flex: 1,
      margin: 4,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      borderRadius: 16,
    },
    pressable: {
      flex: 1,
      padding: 16,
      alignItems: 'center' as 'center',
    },
    countryNameText: {
      marginTop: 8,
      textAlign: 'center' as 'center',
    },
    flashListContainer: {
      flex: 1,
      width: windowWidth - 2 * DEFAULT_SPACING,
    },
    /**
     * Skeleton Loader styles
     */
    skeletonContainer: {
      flex: 1,
      width: '100%' as '100%',
      backgroundColor: theme.colors.surface,
      padding: 8,
      borderRadius: 6,
      marginVertical: 8,
      marginHorizontal: 4,
    },
  };
};

export default homePageStyles;
