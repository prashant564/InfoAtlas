import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MyWorldPage from '@screens/my-world-screen/myWorld.main';
import DetailTravelStatus from '@screens/detail-screen/detail.travelStatus';
import CountryListItem from '@screens/home-screen/home.countryListItem';
import {bundledDataset} from '@services/countries';
import {useAppBoundStore} from '@store/mainStore';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({navigate: jest.fn(), push: jest.fn()}),
}));

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}));

const renderMyWorld = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: {x: 0, y: 0, width: 390, height: 844},
        insets: {top: 0, left: 0, right: 0, bottom: 0},
      }}>
      <MyWorldPage />
    </SafeAreaProvider>,
  );

const findCountry = (cca3: string) =>
  bundledDataset.countries.find(c => c.cca3 === cca3)!;

const setEntries = (entries: object) =>
  useAppBoundStore.setState({
    allCountryDetailsList: bundledDataset.countries,
    travelEntries: entries as any,
  });

describe('Travel tracker UI', () => {
  beforeEach(() => setEntries({}));

  describe('DetailTravelStatus', () => {
    test('toggles visited and wishlist exclusively', () => {
      render(<DetailTravelStatus selectedCountry={findCountry('IND')} />);

      fireEvent.press(screen.getByText('Been here'));
      expect(useAppBoundStore.getState().travelEntries.IND.status).toBe(
        'visited',
      );

      fireEvent.press(screen.getByText('Want to go'));
      expect(useAppBoundStore.getState().travelEntries.IND.status).toBe(
        'wishlist',
      );

      fireEvent.press(screen.getByText('Want to go'));
      expect(useAppBoundStore.getState().travelEntries.IND).toBeUndefined();
    });
  });

  test('CountryListItem shows a badge for tracked countries', () => {
    setEntries({IND: {status: 'visited', updatedAt: '2026-01-01'}});
    render(<CountryListItem item={findCountry('IND')} />);
    expect(screen.getByLabelText('Visited')).toBeTruthy();

    render(<CountryListItem item={findCountry('CAN')} />);
    expect(screen.queryByLabelText('On wishlist')).toBeNull();
  });

  describe('MyWorldPage', () => {
    test('shows stats and switches between visited and wishlist', () => {
      setEntries({
        FRA: {status: 'visited', updatedAt: '2026-03-01'},
        PER: {status: 'wishlist', updatedAt: '2026-02-01'},
      });
      renderMyWorld();

      expect(screen.getByText('Countries visited')).toBeTruthy();
      expect(screen.getByText('of 193 · 1%')).toBeTruthy();
      expect(screen.getByText('France')).toBeTruthy();
      expect(screen.queryByText('Peru')).toBeNull();

      fireEvent.press(screen.getByText('Wishlist (1)'));

      expect(screen.getByText('Peru')).toBeTruthy();
      expect(screen.queryByText('France')).toBeNull();
    });

    test('explains how to start when empty', () => {
      renderMyWorld();
      expect(screen.getByText('No countries visited yet.')).toBeTruthy();

      fireEvent.press(screen.getByText('Wishlist (0)'));
      expect(screen.getByText('Your wishlist is empty.')).toBeTruthy();
    });
  });
});
