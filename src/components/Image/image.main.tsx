import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';

import {useAppTheme} from '@themes/getTheme';

import {DEFUALT_SIZE, imageSizePresets} from './image.presets';

import {AvatarImageProps} from './typings';

const Image = (props: AvatarImageProps) => {
  const {theme} = useAppTheme();
  const {
    source,
    size = 'md',
    style,
    onError,
    onLayout,
    onLoad,
    onLoadStart,
    onLoadEnd,
    onProgress,
  } = props;
  const imgSize =
    imageSizePresets[size as keyof typeof imageSizePresets] || DEFUALT_SIZE;
  const defaultContainerView = {
    backgroundColor: theme?.appColors.transparent,
  };
  const iconStyle = StyleSheet.flatten([defaultContainerView, style]);

  return (
    <Avatar.Image
      source={source}
      size={imgSize}
      style={iconStyle}
      onError={onError}
      onLayout={onLayout}
      onLoad={onLoad}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onProgress={onProgress}
    />
  );
};

export default Image;
