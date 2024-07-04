/* eslint-disable react-hooks/exhaustive-deps */
import {TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';

import {Screen, SearchBar} from '@components';
import {Else, If, Then} from '@components/Conditionals';

import {useAppTheme} from '@themes';

import {useAppBoundStore} from '@store/mainStore';

import {CountryDetailsItem} from '@services/api';

import {debounce} from '@utils/utils';
import {DUMMY_SKELETON_ARRAY} from '@utils/constants';

import homePageStyles from '@screens/home-screen/styles';
import {SkeletonLoader} from '@screens/home-screen/home.skeletonLoader';
import CountryListItem from '@screens/home-screen/home.countryListItem';
import {EmptyUIView} from '@components/EmptyUIView';

const HomePage = () => {
  const [filteredCountryList, setFilteredCountryList] = useState<
    CountryDetailsItem[]
  >([]);

  const {theme} = useAppTheme();
  const isFocused = useIsFocused();

  const searchInputRef = useRef<TextInput>(null);

  const {favCountriesList, __fetchAllFavCountriesDetails} = useAppBoundStore(
    state => ({
      favCountriesList: state.favCountriesList,
      __fetchAllFavCountriesDetails: state.__fetchAllFavCountriesDetails,
    }),
  );

  const {outerContainer, mainContainer, flashListContainer} =
    homePageStyles(theme);

  useEffect(() => {
    setFilteredCountryList(favCountriesList);
  }, [favCountriesList]);

  useEffect(() => {
    isFocused && __fetchAllFavCountriesDetails();
  }, [isFocused]);

  const filterAndUpdateCountryList = debounce(query => {
    const searchedText = query.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    if (searchedText == null || searchedText === '') {
      resetCountriesList();
    } else {
      const updatedList = favCountriesList.filter(countryItem => {
        const {name} = countryItem;
        const {common, official} = name;
        return (
          common.toLowerCase().startsWith(searchedText) ||
          official.toLowerCase().startsWith(searchedText)
        );
      });
      setFilteredCountryList(updatedList);
    }
  }, 250);

  const resetCountriesList = () => {
    setFilteredCountryList(favCountriesList);
  };

  const resetSearchBar = () => {
    searchInputRef.current?.clear();
  };

  const onChangeSearch = (query: string) => {
    filterAndUpdateCountryList(query);
  };

  const handleOnClosePressed = () => {
    resetCountriesList();
    resetSearchBar();
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
              data={filteredCountryList}
              renderItem={({item}) => {
                return <CountryListItem item={item} />;
              }}
              estimatedItemSize={12}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.name.official?.toString()}
              numColumns={2}
              ListEmptyComponent={
                <EmptyUIView msg={'No favourite countries saved.'} />
              }
            />
          </View>
        </View>
      </Screen>
    </View>
  );
};

export default HomePage;
