/* eslint-disable react-hooks/exhaustive-deps */
import {TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';

import {Screen, SearchBar} from '@components';
import {Else, If, Then} from '@components/Conditionals';

import {useAppBoundStore} from '@store/mainStore';

import {useAppTheme} from '@themes';

import {CountryDetailsItem} from '@services/api';

import {debounce} from '@utils/utils';

import CountryListItem from './home.countryListItem';
import {SkeletonLoader} from './home.skeletonLoader';

import homePageStyles from './styles';

const HomePage = () => {
  const [filteredCountryList, setFilteredCountryList] = useState<
    CountryDetailsItem[]
  >([]);

  const {theme} = useAppTheme();

  const searchInputRef = useRef<TextInput>(null);

  const dummySkeletonArray = Array.from({length: 12}, (_, index) => index + 1);

  const {outerContainer, mainContainer, flashListContainer} =
    homePageStyles(theme);

  const {__fetchAllCountriesDetails, allCountryDetailsList} = useAppBoundStore(
    state => ({
      __fetchAllCountriesDetails: state.__fetchAllCountriesDetails,
      allCountryDetailsList: state.allCountryDetailsList,
    }),
  );

  useEffect(() => {
    setFilteredCountryList(allCountryDetailsList);
  }, [allCountryDetailsList]);

  useEffect(() => {
    __fetchAllCountriesDetails();
  }, []);

  const filterAndUpdateCountryList = debounce(query => {
    const searchedText = query.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    if (searchedText == null || searchedText === '') {
      resetCountriesList();
    } else {
      const updatedList = allCountryDetailsList.filter(countryItem => {
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
    setFilteredCountryList(allCountryDetailsList);
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
          <If condition={allCountryDetailsList.length === 0}>
            <Then>
              <View style={flashListContainer}>
                <FlashList
                  data={dummySkeletonArray}
                  renderItem={() => {
                    return <SkeletonLoader />;
                  }}
                  estimatedItemSize={12}
                  keyExtractor={index => index.toString()}
                  numColumns={2}
                />
              </View>
            </Then>
            <Else>
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
                />
              </View>
            </Else>
          </If>
        </View>
      </Screen>
    </View>
  );
};

export default HomePage;
