import {ImageProps, StyleProp, ViewStyle} from 'react-native';
import {AvatarImageSource} from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
import {ImageSizePresets} from './image.presets';

export interface AvatarImageProps {
  source: AvatarImageSource;
  size?: ImageSizePresets;
  style?: StyleProp<ViewStyle>;
  onError?: ImageProps['onError'];
  onLayout?: ImageProps['onLayout'];
  onLoad?: ImageProps['onLoad'];
  onLoadStart?: ImageProps['onLoadStart'];
  onLoadEnd?: ImageProps['onLoadEnd'];
  onProgress?: ImageProps['onProgress'];
}
