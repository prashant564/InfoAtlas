import React from 'react';
import {render, screen} from '@testing-library/react-native';
import DetailGeneralInfoSection from '@screens/detail-screen/detail.generalInfo';
import DetailAdditionalInfoSection from '@screens/detail-screen/detail.additionalInfo';
import DetailTranslationList from '@screens/detail-screen/detail.translation';
import {bundledDataset} from '@services/countries';
import {useAppBoundStore} from '@store/mainStore';
import {NOT_AVAILABLE} from '@utils/constants';

const findCountry = (cca3: string) =>
  bundledDataset.countries.find(c => c.cca3 === cca3)!;

describe('Detail Screen Components', () => {
  const aruba = findCountry('ABW');
  const antarctica = findCountry('ATA');
  const switzerland = findCountry('CHE');

  beforeEach(() => {
    useAppBoundStore.setState({
      allCountryDetailsList: bundledDataset.countries,
    });
  });

  test('renders DetailGeneralInfoSection for country with empty car signs (Aruba)', () => {
    render(<DetailGeneralInfoSection selectedCountry={aruba} />);
    expect(screen.getByText('Oranjestad')).toBeTruthy();
  });

  test('shows a placeholder, not NaN, for missing currencies & languages (Antarctica)', () => {
    render(<DetailGeneralInfoSection selectedCountry={antarctica} />);
    expect(screen.queryByText('NaN')).toBeNull();
    expect(screen.getAllByText(NOT_AVAILABLE).length).toBeGreaterThan(0);
  });

  test('lists full language names and every currency', () => {
    render(<DetailGeneralInfoSection selectedCountry={switzerland} />);
    expect(screen.getByText(/French/)).toBeTruthy();
    expect(screen.getByText(/Swiss franc/)).toBeTruthy();
  });

  test('shows Landlocked as Yes/No rather than the population', () => {
    render(<DetailAdditionalInfoSection selectedCountry={switzerland} />);
    expect(screen.getAllByText('Yes').length).toBeGreaterThan(0);
    expect(screen.queryByText(/\d{1,3},\d{3}/)).toBeNull();
  });

  test('shows border country names instead of codes', () => {
    render(<DetailAdditionalInfoSection selectedCountry={switzerland} />);
    expect(screen.getByText(/Austria/)).toBeTruthy();
    expect(screen.queryByText(/AUT/)).toBeNull();
  });

  test('renders DetailTranslationList correctly', () => {
    render(<DetailTranslationList translations={aruba.translations} />);
    expect(screen.getByText('Translations')).toBeTruthy();
  });
});
