import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WorldMapScreen from '@screens/world-map-screen/worldMap.main';
import WorldMap from '@components/WorldMap/worldMap.main';
import {bundledDataset} from '@services/countries';
import {useAppBoundStore} from '@store/mainStore';
import {lightPalette} from '@themes/palette';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({navigate: mockNavigate, goBack: jest.fn()}),
}));

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}));

const renderScreen = () => {
  const result = render(
    <SafeAreaProvider
      initialMetrics={{
        frame: {x: 0, y: 0, width: 390, height: 844},
        insets: {top: 0, left: 0, right: 0, bottom: 0},
      }}>
      <WorldMapScreen />
    </SafeAreaProvider>,
  );
  // The map is sized from its container.
  fireEvent(screen.getByTestId('zoomable-world-map'), 'layout', {
    nativeEvent: {layout: {width: 358, height: 500}},
  });
  return result;
};

// Tiny countries have both a shape and a dot; they always match.
const pressCountry = (cca3: string) => {
  const [shape] = screen.UNSAFE_getAllByProps({id: cca3});
  act(() => shape.props.onPress(cca3));
};

const fillOf = (cca3: string) => {
  const fills = screen
    .UNSAFE_getAllByProps({id: cca3})
    .map(element => element.props.fill);
  expect(new Set(fills).size).toBe(1);
  return fills[0];
};

describe('WorldMapScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useAppBoundStore.setState({
      allCountryDetailsList: bundledDataset.countries,
      travelEntries: {},
    });
  });

  test('shows how to use the map until a country is tapped', () => {
    renderScreen();
    expect(
      screen.getByText(
        'Tap a country to mark it. Pinch or double-tap to zoom.',
      ),
    ).toBeTruthy();
    expect(screen.getByLabelText('Zoom in')).toBeTruthy();
  });

  test('marks a tapped country without leaving the map', () => {
    renderScreen();
    expect(fillOf('FRA')).toBe(lightPalette.mapLand);

    pressCountry('FRA');
    expect(screen.getByText('France')).toBeTruthy();

    // The legend uses the same words.
    fireEvent.press(screen.getByRole('button', {name: 'Been here'}));
    expect(useAppBoundStore.getState().travelEntries.FRA.status).toBe(
      'visited',
    );
    expect(fillOf('FRA')).toBe(lightPalette.visited);

    fireEvent.press(screen.getByText('Details'));
    expect(mockNavigate).toHaveBeenCalledWith('DetailScreen', {
      selectedCountry: expect.objectContaining({cca3: 'FRA'}),
    });
  });

  test('tapping the selected country again clears the selection', () => {
    renderScreen();
    pressCountry('JPN');
    expect(screen.getByText('Japan')).toBeTruthy();

    pressCountry('JPN');
    expect(screen.queryByText('Japan')).toBeNull();
  });

  test('tiny countries are tappable dots', () => {
    renderScreen();
    pressCountry('SGP');
    expect(screen.getByText('Singapore')).toBeTruthy();
  });
});

describe('WorldMap', () => {
  test('colours countries by travel status', () => {
    render(
      <WorldMap
        width={300}
        travelEntries={{
          IND: {status: 'visited', updatedAt: '2026-01-01'},
          PER: {status: 'wishlist', updatedAt: '2026-01-01'},
          MCO: {status: 'visited', updatedAt: '2026-01-01'},
        }}
      />,
    );
    expect(fillOf('IND')).toBe(lightPalette.visited);
    expect(fillOf('PER')).toBe(lightPalette.wishlist);
    expect(fillOf('CAN')).toBe(lightPalette.mapLand);
    // Monaco is too small for a shape, so it's drawn as a dot.
    expect(fillOf('MCO')).toBe(lightPalette.visited);
  });

  test('ignores touches when it is only a preview', () => {
    render(<WorldMap width={300} travelEntries={{}} />);
    expect(screen.UNSAFE_getByProps({id: 'FRA'}).props.onPress).toBeUndefined();
  });
});
