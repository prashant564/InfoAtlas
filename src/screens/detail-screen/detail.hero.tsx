import {View} from 'react-native';
import React, {useState} from 'react';
import {Card, Surface} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {formatCompactArea, formatCompactNumber} from '@utils/countryFacts';
import {joinOrNotAvailable} from '@utils/utils';

import {DetailScreenStyles} from './styles';

export type DetailHeroProps = {
  selectedCountry: CountryDetailsItem;
};

const QuickFact = ({label, value}: {label: string; value: string}) => {
  const {theme} = useAppTheme();
  const {quickFact} = DetailScreenStyles(theme);

  return (
    <View style={quickFact}>
      <Text variant={'titleMedium'} numberOfLines={1} children={value} />
      <Text type={'secondary'} variant={'labelMedium'} children={label} />
    </View>
  );
};

const DetailHero = ({selectedCountry}: DetailHeroProps) => {
  const {theme} = useAppTheme();

  const {flag, flags, name, region, subregion, capital, population, area} =
    selectedCountry;

  const [flagFailed, setFlagFailed] = useState(!flags?.png);

  const {
    flagEmojiCover,
    flagEmojiText,
    heroNameBlock,
    pillRow,
    pill,
    quickFactsRow,
    quickFactDivider,
  } = DetailScreenStyles(theme);

  const regionPills = [region, subregion].filter(
    (value, index, all): value is string =>
      !!value && all.indexOf(value) === index,
  );

  return (
    <View>
      <Card>
        {flagFailed ? (
          <Card.Content style={flagEmojiCover}>
            <Text style={flagEmojiText}>{flag}</Text>
          </Card.Content>
        ) : (
          <Card.Cover
            source={{uri: flags?.png}}
            resizeMethod="resize"
            accessibilityLabel={flags?.alt}
            onError={() => setFlagFailed(true)}
          />
        )}
      </Card>

      <View style={heroNameBlock}>
        <Text variant={'headlineMedium'} children={name.common} />
        {name.official !== name.common && (
          <Text
            type={'secondary'}
            variant={'bodyMedium'}
            children={name.official}
          />
        )}
      </View>

      {regionPills.length > 0 && (
        <View style={pillRow}>
          {regionPills.map(label => (
            <View key={label} style={pill}>
              <Text variant={'labelLarge'} children={label} />
            </View>
          ))}
        </View>
      )}

      <Surface elevation={2} style={quickFactsRow}>
        <QuickFact
          label={capital && capital.length > 1 ? 'Capitals' : 'Capital'}
          value={joinOrNotAvailable(capital)}
        />
        <View style={quickFactDivider} />
        <QuickFact
          label={'Population'}
          value={formatCompactNumber(population)}
        />
        <View style={quickFactDivider} />
        <QuickFact label={'Area'} value={formatCompactArea(area)} />
      </Surface>
    </View>
  );
};

export default DetailHero;
