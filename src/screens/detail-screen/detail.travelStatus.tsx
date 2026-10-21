import {View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {useAppBoundStore} from '@store/mainStore';
import {TravelStatus} from '@store/stores/travel';

import {DetailScreenStyles} from './styles';

export type DetailTravelStatusProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailTravelStatus = ({selectedCountry}: DetailTravelStatusProps) => {
  const {theme} = useAppTheme();
  const {cca3} = selectedCountry;

  const {status, __setTravelStatus} = useAppBoundStore(state => ({
    status: state.travelEntries[cca3]?.status ?? null,
    __setTravelStatus: state.__setTravelStatus,
  }));

  const {actionsRow, actionButton} = DetailScreenStyles(theme);

  const toggle = (target: TravelStatus) => {
    __setTravelStatus(cca3, status === target ? null : target);
  };

  const buttonProps = (target: TravelStatus) => {
    const active = status === target;
    return {
      mode: 'contained' as const,
      style: actionButton,
      buttonColor: active
        ? theme.colors.activeBackground
        : theme.colors.inactiveBackground,
      textColor: active ? theme.colors.activeText : theme.colors.text,
      accessibilityState: {selected: active},
      onPress: () => toggle(target),
    };
  };

  return (
    <View style={actionsRow}>
      <Button
        {...buttonProps('visited')}
        icon={status === 'visited' ? 'check-circle' : 'check-circle-outline'}>
        Been here
      </Button>
      <Button
        {...buttonProps('wishlist')}
        icon={status === 'wishlist' ? 'star' : 'star-outline'}>
        Want to go
      </Button>
    </View>
  );
};

export default DetailTravelStatus;
