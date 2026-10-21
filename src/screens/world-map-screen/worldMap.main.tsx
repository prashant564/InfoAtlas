import {Pressable, View} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {IconButton, Surface} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  Icon,
  Screen,
  Text,
  ZoomableWorldMap,
  ZoomableWorldMapHandle,
} from '@components';

import {useAppTheme} from '@themes';

import {useAppBoundStore} from '@store/mainStore';

import {DetailScreenStyles} from '@screens/detail-screen/styles';

import WorldMapSelectedCountry from './worldMap.selectedCountry';
import worldMapStyles from './styles';

const LegendItem = ({color, label}: {color: string; label: string}) => {
  const {theme} = useAppTheme();
  const {legendItem, legendSwatch} = worldMapStyles(theme);

  return (
    <View style={legendItem}>
      <View style={[legendSwatch, {backgroundColor: color}]} />
      <Text type={'secondary'} variant={'labelMedium'} children={label} />
    </View>
  );
};

const WorldMapScreen = () => {
  const {theme} = useAppTheme();
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const mapRef = useRef<ZoomableWorldMapHandle>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const {allCountryDetailsList, travelEntries} = useAppBoundStore(state => ({
    allCountryDetailsList: state.allCountryDetailsList,
    travelEntries: state.travelEntries,
  }));

  const selectedCountry = useMemo(
    () => allCountryDetailsList.find(country => country.cca3 === selected),
    [allCountryDetailsList, selected],
  );

  // Stable, so the memoised country shapes don't re-render on every tap.
  const onCountryPress = useCallback((cca3: string) => {
    setSelected(previous => (previous === cca3 ? null : cca3));
  }, []);

  const {
    outerContainer,
    legendRow,
    mapContainer,
    zoomButtons,
    zoomButton,
    bottomPanel,
    hint,
  } = worldMapStyles(theme);
  const {headerContainer, rowItemContainer, headerTitle, headerSideSpacer} =
    DetailScreenStyles(theme);

  const zoomButtonProps = {
    mode: 'contained-tonal' as const,
    size: 20,
    style: zoomButton,
  };

  return (
    <View style={outerContainer}>
      <Screen
        preset="fixed"
        statusBarBg={theme.colors.background}
        statusBar={theme.statusBarStyle}>
        <View style={headerContainer}>
          <View style={rowItemContainer}>
            <Pressable
              accessibilityRole={'button'}
              accessibilityLabel={'Back'}
              style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
              onPress={() => navigation.goBack()}>
              <Icon
                icon={'arrow-left'}
                color={theme.colors.inactiveText}
                size="md"
              />
            </Pressable>
            <Text
              variant={'titleMedium'}
              style={headerTitle}
              children={'Your map'}
            />
            <View style={headerSideSpacer} />
          </View>
        </View>

        <View style={legendRow}>
          <LegendItem color={theme.colors.visited} label={'Been here'} />
          <LegendItem color={theme.colors.wishlist} label={'Want to go'} />
        </View>

        <View style={mapContainer}>
          <ZoomableWorldMap
            ref={mapRef}
            travelEntries={travelEntries}
            selected={selected}
            onCountryPress={onCountryPress}
          />
          <View style={zoomButtons}>
            <IconButton
              {...zoomButtonProps}
              icon={'plus'}
              accessibilityLabel={'Zoom in'}
              onPress={() => mapRef.current?.zoomIn()}
            />
            <IconButton
              {...zoomButtonProps}
              icon={'minus'}
              accessibilityLabel={'Zoom out'}
              onPress={() => mapRef.current?.zoomOut()}
            />
          </View>
        </View>

        <Surface
          elevation={2}
          style={[bottomPanel, {marginBottom: Math.max(bottom, 16)}]}>
          {selectedCountry ? (
            <WorldMapSelectedCountry country={selectedCountry} />
          ) : (
            <Text
              type={'secondary'}
              variant={'bodyMedium'}
              style={hint}
              children={
                'Tap a country to mark it. Pinch or double-tap to zoom.'
              }
            />
          )}
        </Surface>
      </Screen>
    </View>
  );
};

export default WorldMapScreen;
