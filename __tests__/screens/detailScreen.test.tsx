import React from 'react';
import {Linking, Share} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import DetailHero from '@screens/detail-screen/detail.hero';
import DetailLocalTime from '@screens/detail-screen/detail.localTime';
import DetailFacts, {
  getFactSections,
} from '@screens/detail-screen/detail.facts';
import DetailBorders from '@screens/detail-screen/detail.borders';
import DetailActions from '@screens/detail-screen/detail.actions';
import DetailCoatOfArms from '@screens/detail-screen/detail.coatOfArms';
import DetailTranslationList, {
  TRANSLATION_LANGUAGES,
} from '@screens/detail-screen/detail.translation';
import {bundledDataset} from '@services/countries';
import {useAppBoundStore} from '@store/mainStore';
import {NOT_AVAILABLE} from '@utils/constants';

const mockPush = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({push: mockPush}),
}));

const findCountry = (cca3: string) =>
  bundledDataset.countries.find(c => c.cca3 === cca3)!;

const factValue = (cca3: string, label: string) =>
  getFactSections(findCountry(cca3))
    .flatMap(section => section.facts)
    .find(fact => fact.label === label)?.value;

describe('Detail Screen Components', () => {
  const india = findCountry('IND');
  const switzerland = findCountry('CHE');
  const antarctica = findCountry('ATA');
  const iceland = findCountry('ISL');

  beforeEach(() => {
    jest.clearAllMocks();
    useAppBoundStore.setState({
      allCountryDetailsList: bundledDataset.countries,
    });
  });

  describe('DetailHero', () => {
    test('shows names, region pills and quick facts', () => {
      render(<DetailHero selectedCountry={india} />);
      expect(screen.getByText('India')).toBeTruthy();
      expect(screen.getByText('Republic of India')).toBeTruthy();
      expect(screen.getByText('Asia')).toBeTruthy();
      expect(screen.getByText('Southern Asia')).toBeTruthy();
      expect(screen.getByText('New Delhi')).toBeTruthy();
      expect(screen.getByText(/^1\.\dB$/)).toBeTruthy();
      expect(screen.getByText('3.3M km²')).toBeTruthy();
    });

    test('labels multiple capitals', () => {
      render(<DetailHero selectedCountry={findCountry('ZAF')} />);
      expect(screen.getByText('Capitals')).toBeTruthy();
    });
  });

  test('DetailLocalTime shows the current time and offset', () => {
    render(<DetailLocalTime selectedCountry={india} />);
    expect(screen.getByText('Right now')).toBeTruthy();
    expect(screen.getByText(/^\d{1,2}:\d{2} (AM|PM)$/)).toBeTruthy();
    expect(screen.getByText('UTC+05:30')).toBeTruthy();
  });

  describe('DetailFacts', () => {
    test('renders every section without NaN', () => {
      render(<DetailFacts selectedCountry={antarctica} />);
      ['People', 'Geography', 'Economy & Status', 'Practical'].forEach(title =>
        expect(screen.getByText(title)).toBeTruthy(),
      );
      expect(screen.queryByText('NaN')).toBeNull();
      expect(screen.getAllByText(NOT_AVAILABLE).length).toBeGreaterThan(0);
    });

    test('computes facts from the dataset', () => {
      expect(factValue('CHE', 'Landlocked')).toBe('Yes');
      expect(factValue('CHE', 'Languages')).toMatch(/French/);
      expect(factValue('IND', 'Calling Code')).toBe('+91');
      expect(factValue('IND', 'Internet Domain')).toBe('.in');
      expect(factValue('GBR', 'Drives On')).toBe('Left');
      expect(factValue('IND', 'Demonym')).toBe('Indian');
      expect(factValue('SJM', 'Area')).toBe(NOT_AVAILABLE);
    });
  });

  describe('DetailBorders', () => {
    test('shows neighbours by name and opens them on tap', () => {
      render(<DetailBorders selectedCountry={switzerland} />);
      expect(screen.queryByText(/AUT/)).toBeNull();

      fireEvent.press(screen.getByText(/Austria/));

      expect(mockPush).toHaveBeenCalledWith('DetailScreen', {
        selectedCountry: findCountry('AUT'),
      });
    });

    test('says when a country has no land borders', () => {
      render(<DetailBorders selectedCountry={iceland} />);
      expect(screen.getByText('No land borders')).toBeTruthy();
    });
  });

  describe('DetailActions', () => {
    test('opens maps and the share sheet', () => {
      const openURL = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValue(undefined);
      const share = jest
        .spyOn(Share, 'share')
        .mockResolvedValue({action: Share.sharedAction});

      render(<DetailActions selectedCountry={india} />);

      fireEvent.press(screen.getByText('Open in Maps'));
      expect(openURL).toHaveBeenCalledWith(expect.stringContaining('India'));

      fireEvent.press(screen.getByText('Share'));
      expect(share).toHaveBeenCalledWith({
        message: expect.stringContaining('🇮🇳 India'),
      });
    });
  });

  describe('DetailCoatOfArms', () => {
    test('renders the image when available', () => {
      render(<DetailCoatOfArms selectedCountry={india} />);
      expect(screen.getByText('Coat of Arms')).toBeTruthy();
    });

    test('renders nothing when there is no coat of arms', () => {
      render(<DetailCoatOfArms selectedCountry={findCountry('PCN')} />);
      expect(screen.queryByText('Coat of Arms')).toBeNull();
    });

    test('hides itself when the image fails to load', () => {
      render(<DetailCoatOfArms selectedCountry={india} />);
      fireEvent(screen.getByLabelText('Coat of arms of India'), 'error');
      expect(screen.queryByText('Coat of Arms')).toBeNull();
    });
  });

  describe('DetailTranslationList', () => {
    test('every dataset language code has a readable name', () => {
      const codes = new Set(
        bundledDataset.countries.flatMap(c => Object.keys(c.translations)),
      );
      [...codes].forEach(code =>
        expect(TRANSLATION_LANGUAGES[code]).toBeDefined(),
      );
    });

    test('shows a few languages and expands to all', () => {
      render(<DetailTranslationList translations={india.translations} />);

      expect(screen.getByText('Arabic')).toBeTruthy();
      expect(screen.queryByText('Japanese')).toBeNull();

      fireEvent.press(screen.getByText(/^Show all \d+$/));

      expect(screen.getByText('Japanese')).toBeTruthy();
      expect(screen.getByText('インド')).toBeTruthy();
      expect(screen.getByText('Show less')).toBeTruthy();
    });
  });
});
