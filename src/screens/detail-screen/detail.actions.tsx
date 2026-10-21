import {Linking, Share, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {buildCountryShareMessage, getMapsUrl} from '@utils/countryShare';
import {devLogger} from '@utils/logger';

import {DetailScreenStyles} from './styles';

export type DetailActionsProps = {
  selectedCountry: CountryDetailsItem;
};

const DetailActions = ({selectedCountry}: DetailActionsProps) => {
  const {theme} = useAppTheme();
  const {actionsRow, actionButton} = DetailScreenStyles(theme);

  const openInMaps = () => {
    Linking.openURL(getMapsUrl(selectedCountry)).catch(error =>
      devLogger('DetailActions openInMaps', error, 'fail'),
    );
  };

  const shareCountry = () => {
    Share.share({
      message: buildCountryShareMessage(selectedCountry, new Date()),
    }).catch(error => devLogger('DetailActions shareCountry', error, 'fail'));
  };

  const buttonProps = {
    mode: 'contained' as const,
    style: actionButton,
    buttonColor: theme.colors.inactiveBackground,
    textColor: theme.colors.text,
  };

  return (
    <View style={actionsRow}>
      <Button {...buttonProps} icon={'map-outline'} onPress={openInMaps}>
        Open in Maps
      </Button>
      <Button {...buttonProps} icon={'share-variant'} onPress={shareCountry}>
        Share
      </Button>
    </View>
  );
};

export default DetailActions;
