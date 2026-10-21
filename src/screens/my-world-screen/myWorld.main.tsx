import {View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Button} from 'react-native-paper';

import {Screen, Text} from '@components';
import {EmptyUIView} from '@components/EmptyUIView';

import {useAppTheme} from '@themes';

import {useAppBoundStore} from '@store/mainStore';
import {
  TravelStatus,
  getCountriesWithStatus,
  getTravelStats,
} from '@store/stores/travel';

import homePageStyles from '@screens/home-screen/styles';
import CountryListItem from '@screens/home-screen/home.countryListItem';

import MyWorldStats from './myWorld.stats';
import myWorldStyles from './styles';

const EMPTY_STATE: Record<TravelStatus, {msg: string; hint: string}> = {
  visited: {
    msg: 'No countries visited yet.',
    hint: 'Open any country and tap "Been here" to start your map.',
  },
  wishlist: {
    msg: 'Your wishlist is empty.',
    hint: 'Tap "Want to go" on the countries you dream of visiting.',
  },
};

const MyWorldPage = () => {
  const {theme} = useAppTheme();
  const [selectedTab, setSelectedTab] = useState<TravelStatus>('visited');

  const {allCountryDetailsList, travelEntries} = useAppBoundStore(state => ({
    allCountryDetailsList: state.allCountryDetailsList,
    travelEntries: state.travelEntries,
  }));

  const stats = useMemo(
    () => getTravelStats(allCountryDetailsList, travelEntries),
    [allCountryDetailsList, travelEntries],
  );

  const visible = useMemo(
    () =>
      getCountriesWithStatus(allCountryDetailsList, travelEntries, selectedTab),
    [allCountryDetailsList, travelEntries, selectedTab],
  );

  const {outerContainer, mainContainer, flashListContainer} =
    homePageStyles(theme);
  const {tabsRow, tabButton, emptyHint} = myWorldStyles(theme);

  const visitedTotal = stats.visitedCountries + stats.visitedTerritories;

  const tabButtonProps = (tab: TravelStatus) => {
    const active = selectedTab === tab;
    return {
      mode: 'contained' as const,
      style: tabButton,
      buttonColor: active
        ? theme.colors.activeBackground
        : theme.colors.inactiveBackground,
      textColor: active ? theme.colors.activeText : theme.colors.text,
      accessibilityState: {selected: active},
      onPress: () => setSelectedTab(tab),
    };
  };

  return (
    <View style={[outerContainer]}>
      <Screen
        preset="fixed"
        unsafe
        statusBarBg={theme.colors.background}
        statusBar="light-content">
        <View style={mainContainer}>
          <View style={flashListContainer}>
            <FlashList
              data={visible}
              renderItem={({item}) => <CountryListItem item={item} />}
              estimatedItemSize={12}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.cca3}
              numColumns={2}
              ListHeaderComponent={
                <View>
                  <MyWorldStats stats={stats} />
                  <View style={tabsRow}>
                    <Button
                      {...tabButtonProps('visited')}
                      icon={'check-circle-outline'}>
                      {`Visited (${visitedTotal})`}
                    </Button>
                    <Button
                      {...tabButtonProps('wishlist')}
                      icon={'star-outline'}>
                      {`Wishlist (${stats.wishlistCount})`}
                    </Button>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View>
                  <EmptyUIView msg={EMPTY_STATE[selectedTab].msg} />
                  <Text
                    type={'secondary'}
                    variant={'bodyMedium'}
                    style={emptyHint}
                    children={EMPTY_STATE[selectedTab].hint}
                  />
                </View>
              }
            />
          </View>
        </View>
      </Screen>
    </View>
  );
};

export default MyWorldPage;
