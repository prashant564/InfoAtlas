import {View} from 'react-native';
import React from 'react';
import {Text} from '@components';
import {DetailScreenRouteProp} from '@navigation';
import {useRoute} from '@react-navigation/native';

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();

  return (
    <View>
      <Text>{JSON.stringify(route.params.selectedCountry.continents)}</Text>
    </View>
  );
};

export default DetailScreen;
