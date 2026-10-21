import {View} from 'react-native';
import React, {memo, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Card} from 'react-native-paper';

import {Screen, Text} from '@components';

import {DetailScreenRouteProp} from '@navigation';

import {useAppTheme} from '@themes';

import DetailHeader from './detail.header';
import DetailGeneralInfoSection from './detail.generalInfo';
import DetailTranslationList from './detail.translation';
import DetailAdditionalInfoSection from './detail.additionalInfo';

import {DetailScreenStyles} from './styles';

const DetailScreen = () => {
  const {theme} = useAppTheme();
  const route = useRoute<DetailScreenRouteProp>();
  const {top} = useSafeAreaInsets();

  const {flag, flags, translations} = route.params.selectedCountry;

  const [flagFailed, setFlagFailed] = useState(!flags?.png);

  const {
    outerContainer,
    mainContainer,
    fullWidthContainer,
    flagEmojiCover,
    flagEmojiText,
  } = DetailScreenStyles(theme);

  return (
    <View style={[outerContainer, {top}]}>
      <DetailHeader selectedCountry={route.params.selectedCountry} />
      <Screen
        preset="scroll"
        statusBarBg={theme.colors.background}
        statusBar="light-content">
        <View style={mainContainer}>
          <View style={fullWidthContainer}>
            <Card>
              {flagFailed ? (
                <Card.Content style={flagEmojiCover}>
                  <Text style={flagEmojiText}>{flag}</Text>
                </Card.Content>
              ) : (
                <Card.Cover
                  source={{uri: flags?.png}}
                  resizeMethod="resize"
                  onError={() => setFlagFailed(true)}
                />
              )}
            </Card>
            {/**
             * General Information
             */}
            <DetailGeneralInfoSection
              selectedCountry={route.params.selectedCountry}
            />
            {/**
             * Translations
             */}
            <DetailTranslationList translations={translations} />
            {/**
             * Additional Details
             */}
            <DetailAdditionalInfoSection
              selectedCountry={route.params.selectedCountry}
            />
          </View>
        </View>
      </Screen>
    </View>
  );
};

export default memo(DetailScreen);
