import {StyleProp, ViewStyle} from 'react-native';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

export interface AvatarIconProps {
  icon: IconSource;
  size?: IconSizePresets;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
