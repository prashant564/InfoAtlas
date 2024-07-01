/* eslint-disable react/react-in-jsx-scope */
import Skeleton from 'react-native-reanimated-skeleton';

import {useAppTheme} from '@themes';

import homePageStyles from './styles';

export const SkeletonLoader = () => {
  const {theme} = useAppTheme();

  const {skeletonContainer} = homePageStyles(theme);

  return (
    <Skeleton
      containerStyle={skeletonContainer}
      isLoading={true}
      boneColor={theme.appColors.primary300}
      highlightColor={theme.appColors.white__a3}
      layout={[
        {
          flex: 1,
          flexDirection: 'row',
          children: [
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: 100,
              width: '30%',
              children: [
                {
                  width: 48,
                  height: 48,
                  borderRadius: 48,
                },
                {
                  width: '50%',
                  height: 16,
                  marginTop: 16,
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
