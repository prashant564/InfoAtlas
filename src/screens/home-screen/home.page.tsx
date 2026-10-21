import {TextInput, View} from 'react-native';
import React, {useRef} from 'react';
import {FlashList} from '@shopify/flash-list';

import {Screen, SearchBar} from '@components';
import {Else, If, Then} from '@components/Conditionals';
import {EmptyUIView} from '@components/EmptyUIView';

import {useAppBoundStore} from '@store/mainStore';

import {useAppTheme} from '@themes';

import {useCountrySearch} from '@utils/countrySearch';
import {DUMMY_SKELETON_ARRAY} from '@utils/constants';

import CountryListItem from './home.countryListItem';
import {SkeletonLoader} from './home.skeletonLoader';

import homePageStyles from './styles';

const HomePage = () => {
  const {theme} = useAppTheme();

  const searchInputRef = useRef<TextInput>(null);

  const {allCountryDetailsList, isCountriesLoaded} = useAppBoundStore(
    state => ({
      allCountryDetailsList: state.allCountryDetailsList,
      isCountriesLoaded: state.isCountriesLoaded,
    }),
  );

  const {results, onChangeSearch, clearSearch} = useCountrySearch(
    allCountryDetailsList,
  );

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
          <If condition={!isCountriesLoaded}>
            <Then>
              <View style={flashListContainer}>
                <FlashList
                  data={DUMMY_SKELETON_ARRAY}
                  renderItem={() => {
                    return <SkeletonLoader />;
                  }}
                  estimatedItemSize={12}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={index => index.toString()}
                  numColumns={2}
                />
              </View>
            </Then>
            <Else>
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
                    <EmptyUIView msg={'No countries match your search.'} />
                  }
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
