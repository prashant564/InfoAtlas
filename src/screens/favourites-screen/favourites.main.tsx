import {TextInput, View} from 'react-native';
import React, {useMemo, useRef} from 'react';
import {FlashList} from '@shopify/flash-list';

import {Screen, SearchBar} from '@components';
import {EmptyUIView} from '@components/EmptyUIView';

import {useAppTheme} from '@themes';

import {useAppBoundStore} from '@store/mainStore';
import {getFavCountries} from '@store/stores/favCountries';

import {useCountrySearch} from '@utils/countrySearch';

import homePageStyles from '@screens/home-screen/styles';
import CountryListItem from '@screens/home-screen/home.countryListItem';

const FavouritesPage = () => {
  const {theme} = useAppTheme();

  const searchInputRef = useRef<TextInput>(null);

  const {allCountryDetailsList, favCountryCodes} = useAppBoundStore(state => ({
    allCountryDetailsList: state.allCountryDetailsList,
    favCountryCodes: state.favCountryCodes,
  }));

  const favCountriesList = useMemo(
    () => getFavCountries(allCountryDetailsList, favCountryCodes),
    [allCountryDetailsList, favCountryCodes],
  );

  const {query, results, onChangeSearch, clearSearch} =
    useCountrySearch(favCountriesList);

  const {outerContainer, mainContainer, flashListContainer} =
    homePageStyles(theme);

  const handleOnClosePressed = () => {
    searchInputRef.current?.clear();
    clearSearch();
  };

  return (
    <View style={[outerContainer]}>
      <Screen
        preset="fixed"
        unsafe
        hasPTR
        statusBarBg={theme.colors.background}
        statusBar="light-content">
        <View style={mainContainer}>
          <SearchBar
            onChangeSearch={onChangeSearch}
            searchInputRef={searchInputRef}
            handleOnClosePressed={handleOnClosePressed}
          />
          <View style={flashListContainer}>
            <FlashList
              data={results}
              renderItem={({item}) => {
                return <CountryListItem item={item} />;
              }}
              estimatedItemSize={12}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.cca3}
              numColumns={2}
              ListEmptyComponent={
                <EmptyUIView
                  msg={
                    query !== '' && favCountriesList.length > 0
                      ? 'No favourites match your search.'
                      : 'No favourite countries saved.'
                  }
                />
              }
            />
          </View>
        </View>
      </Screen>
    </View>
  );
};

export default FavouritesPage;
