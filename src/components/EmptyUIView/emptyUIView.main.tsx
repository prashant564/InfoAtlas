import {View, Text} from 'react-native';
import React from 'react';

import {Image} from '@components';

import {useAppTheme} from '@themes/getTheme';

import {rasters} from '@icons';

import {EmptyUIViewProps} from './typings';

import {EmptyUIViewStyles} from './styles';

const EmptyUIView = ({image, msg}: EmptyUIViewProps) => {
  const {theme} = useAppTheme();
  const {emptyFile} = rasters;
  const imageToShow = image !== undefined ? image : emptyFile;

  const {mainContainer, msgText} = EmptyUIViewStyles(theme);

  return (
    <View style={mainContainer}>
      <Image source={imageToShow} size={'xxl'} />
      <Text style={msgText}>{msg}</Text>
    </View>
  );
};

export default EmptyUIView;
