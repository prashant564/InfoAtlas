import {Image, View} from 'react-native';
import React, {useState} from 'react';
import {Surface} from 'react-native-paper';

import {Text} from '@components';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {DetailScreenStyles} from './styles';

export type DetailCoatOfArmsProps = {
  selectedCountry: CountryDetailsItem;
};

/**
 * Hidden when the country has none or the image can't load (e.g. offline),
 * rather than showing an empty box.
 */
const DetailCoatOfArms = ({selectedCountry}: DetailCoatOfArmsProps) => {
  const {theme} = useAppTheme();
  const uri = selectedCountry.coatOfArms?.png;
  const [failed, setFailed] = useState(false);

  const {sectionTitle, coatOfArmsCard, coatOfArmsImage} =
    DetailScreenStyles(theme);

  if (!uri || failed) {
    return null;
  }

  return (
    <View>
      <Text
        variant={'titleLarge'}
        style={sectionTitle}
        children={'Coat of Arms'}
      />
      <Surface elevation={2} style={coatOfArmsCard}>
        <Image
          source={{uri}}
          style={coatOfArmsImage}
          resizeMode={'contain'}
          accessibilityLabel={`Coat of arms of ${selectedCountry.name.common}`}
          onError={() => setFailed(true)}
        />
      </Surface>
    </View>
  );
};

export default DetailCoatOfArms;
