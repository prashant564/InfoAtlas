import {View} from 'react-native';
import React from 'react';
import {Surface} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {TravelStats} from '@store/stores/travel';

import myWorldStyles from './styles';

const MiniStat = ({value, label}: {value: string; label: string}) => {
  const {theme} = useAppTheme();
  const {miniStat} = myWorldStyles(theme);

  return (
    <View style={miniStat}>
      <Text variant={'titleMedium'} children={value} />
      <Text type={'secondary'} variant={'labelMedium'} children={label} />
    </View>
  );
};

export type MyWorldStatsProps = {
  stats: TravelStats;
};

const MyWorldStats = ({stats}: MyWorldStatsProps) => {
  const {theme} = useAppTheme();
  const {
    statsCard,
    statsHeadline,
    statsHeadlineSuffix,
    progressTrack,
    progressFill,
    miniStatsRow,
  } = myWorldStyles(theme);

  const {
    visitedCountries,
    visitedTerritories,
    totalCountries,
    visitedPercent,
    visitedContinents,
    totalContinents,
    wishlistCount,
  } = stats;

  return (
    <Surface elevation={2} style={statsCard}>
      <Text
        type={'secondary'}
        variant={'labelMedium'}
        children={'Countries visited'}
      />
      <View style={statsHeadline}>
        <Text variant={'displaySmall'} children={String(visitedCountries)} />
        <Text
          type={'secondary'}
          variant={'titleMedium'}
          style={statsHeadlineSuffix}
          children={`of ${totalCountries} · ${visitedPercent}%`}
        />
      </View>
      <View
        style={progressTrack}
        accessibilityRole={'progressbar'}
        accessibilityValue={{min: 0, max: 100, now: visitedPercent}}>
        <View style={[progressFill, {width: `${visitedPercent}%`}]} />
      </View>
      <View style={miniStatsRow}>
        <MiniStat
          value={`${visitedContinents}/${totalContinents}`}
          label={'Continents'}
        />
        <MiniStat value={String(visitedTerritories)} label={'Territories'} />
        <MiniStat value={String(wishlistCount)} label={'Wishlist'} />
      </View>
    </Surface>
  );
};

export default MyWorldStats;
