import {View} from 'react-native';
import React, {memo} from 'react';
import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Screen} from '@components';

import {DetailScreenRouteProp} from '@navigation';

import {useAppTheme} from '@themes';

import DetailHeader from './detail.header';
import DetailHero from './detail.hero';
import DetailActions from './detail.actions';
import DetailLocalTime from './detail.localTime';
import DetailFacts from './detail.facts';
import DetailBorders from './detail.borders';
import DetailCoatOfArms from './detail.coatOfArms';
import DetailTranslationList from './detail.translation';

import {DetailScreenStyles} from './styles';

const DetailScreen = () => {
  const {theme} = useAppTheme();
  const route = useRoute<DetailScreenRouteProp>();
  const {top} = useSafeAreaInsets();

  const {selectedCountry} = route.params;

  const {outerContainer, mainContainer, fullWidthContainer} =
    DetailScreenStyles(theme);

  return (
    <View style={[outerContainer, {top}]}>
      <DetailHeader selectedCountry={selectedCountry} />
      <Screen
        preset="scroll"
        statusBarBg={theme.colors.background}
        statusBar="light-content">
        <View style={mainContainer}>
          <View style={fullWidthContainer}>
            <DetailHero selectedCountry={selectedCountry} />
            <DetailActions selectedCountry={selectedCountry} />
            <DetailLocalTime selectedCountry={selectedCountry} />
            <DetailFacts selectedCountry={selectedCountry} />
            <DetailBorders selectedCountry={selectedCountry} />
            <DetailCoatOfArms selectedCountry={selectedCountry} />
            <DetailTranslationList
              translations={selectedCountry.translations}
            />
          </View>
        </View>
      </Screen>
    </View>
  );
};

export default memo(DetailScreen);
