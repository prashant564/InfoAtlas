import {View} from 'react-native';
import React from 'react';

import {ChoiceButton} from '@components';

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

  const selectedColors: Record<
    TravelStatus,
    {background: string; text: string}
  > = {
    visited: {
      background: theme.colors.visitedContainer,
      text: theme.colors.onVisitedContainer,
    },
    wishlist: {
      background: theme.colors.wishlistContainer,
      text: theme.colors.onWishlistContainer,
    },
  };

  return (
    <View style={actionsRow}>
      <ChoiceButton
        label={'Been here'}
        icon={status === 'visited' ? 'check-circle' : 'check-circle-outline'}
        selected={status === 'visited'}
        selectedColors={selectedColors.visited}
        style={actionButton}
        onPress={() => toggle('visited')}
      />
      <ChoiceButton
        label={'Want to go'}
        icon={status === 'wishlist' ? 'star' : 'star-outline'}
        selected={status === 'wishlist'}
        selectedColors={selectedColors.wishlist}
        style={actionButton}
        onPress={() => toggle('wishlist')}
      />
    </View>
  );
};

export default DetailTravelStatus;
