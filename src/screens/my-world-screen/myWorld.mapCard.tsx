import {Pressable, View} from 'react-native';
import React, {useState} from 'react';
import {Surface} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Text, WorldMap} from '@components';

import {PrimaryParamList} from '@navigation';

import {useAppTheme} from '@themes';

import {TravelEntries} from '@store/stores/travel';

import myWorldStyles from './styles';

export type MyWorldMapCardProps = {
  travelEntries: TravelEntries;
};

/** A preview of the travel map; tapping it opens the full, zoomable map. */
const MyWorldMapCard = ({travelEntries}: MyWorldMapCardProps) => {
  const {theme} = useAppTheme();
  const navigation = useNavigation<NavigationProp<PrimaryParamList>>();
  const [mapWidth, setMapWidth] = useState(0);

  const {mapCard, mapCardContent, mapCardHeader, mapCardMap} =
    myWorldStyles(theme);

  return (
    <Surface elevation={2} style={mapCard}>
      <Pressable
        accessibilityRole={'button'}
        accessibilityLabel={'Open your travel map'}
        accessibilityHint={'Zoom in and mark countries on the map'}
        onPress={() => navigation.navigate('WorldMapScreen')}
        style={({pressed}) => [mapCardContent, {opacity: pressed ? 0.8 : 1}]}>
        <View style={mapCardHeader}>
          <Text variant={'titleSmall'} children={'Your map'} />
          <MaterialCommunityIcons
            name={'arrow-expand'}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View
          style={mapCardMap}
          onLayout={event => setMapWidth(event.nativeEvent.layout.width)}>
          {mapWidth > 0 && (
            <WorldMap width={mapWidth} travelEntries={travelEntries} />
          )}
        </View>
      </Pressable>
    </Surface>
  );
};

export default MyWorldMapCard;
