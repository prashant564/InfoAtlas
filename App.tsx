/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useAppBoundStore} from '@store/mainStore';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, Text, useColorScheme} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const {__fetchAllCountriesDetails, allCountryDetailsList} = useAppBoundStore(
    state => ({
      __fetchAllCountriesDetails: state.__fetchAllCountriesDetails,
      allCountryDetailsList: state.allCountryDetailsList,
    }),
  );

  useEffect(() => {
    __fetchAllCountriesDetails();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'white'}
      />
      <Text>{`${JSON.stringify(allCountryDetailsList)}`}</Text>
    </SafeAreaView>
  );
}

export default App;
