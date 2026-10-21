import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Surface} from 'react-native-paper';

import {Icon, Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {getLocalTime} from '@utils/countryFacts';

import {DetailScreenStyles} from './styles';

const REFRESH_INTERVAL_MS = 15000;

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};

export type DetailLocalTimeProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailLocalTime = ({selectedCountry}: DetailLocalTimeProps) => {
  const {theme} = useAppTheme();
  const now = useNow(REFRESH_INTERVAL_MS);

  const {localTimeCard, localTimeTextBlock} = DetailScreenStyles(theme);

  const localTime = getLocalTime(selectedCountry, now);
  if (!localTime) {
    return null;
  }

  return (
    <Surface elevation={2} style={localTimeCard}>
      <Icon
        icon={'clock-outline'}
        color={theme.colors.inactiveText}
        size="md"
      />
      <View style={localTimeTextBlock}>
        <Text
          type={'secondary'}
          variant={'labelMedium'}
          children={'Right now'}
        />
        <Text variant={'titleLarge'} children={localTime.time} />
        <Text
          type={'secondary'}
          variant={'bodySmall'}
          children={localTime.detail}
        />
      </View>
    </Surface>
  );
};

export default DetailLocalTime;
