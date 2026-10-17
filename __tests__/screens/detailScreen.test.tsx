import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import DetailGeneralInfoSection from '@screens/detail-screen/detail.generalInfo';
import DetailAdditionalInfoSection from '@screens/detail-screen/detail.additionalInfo';
import DetailTranslationList from '@screens/detail-screen/detail.translation';
import fallbackCountries from '@services/api/fallbackCountries.json';
import {CountryDetailsItem} from '@services/api';

describe('Detail Screen Components', () => {
  const aruba = fallbackCountries.find(
    c => c.name.common === 'Aruba',
  ) as unknown as CountryDetailsItem;

  const antarctica = fallbackCountries.find(
    c => c.name.common === 'Antarctica',
  ) as unknown as CountryDetailsItem;

  test('renders DetailGeneralInfoSection for country with empty car signs (Aruba)', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <DetailGeneralInfoSection selectedCountry={aruba} />,
      );
    });
    expect(tree).toBeDefined();
  });

  test('renders DetailGeneralInfoSection for country with empty currencies & languages (Antarctica)', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <DetailGeneralInfoSection selectedCountry={antarctica} />,
      );
    });
    expect(tree).toBeDefined();
  });

  test('renders DetailAdditionalInfoSection correctly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <DetailAdditionalInfoSection selectedCountry={aruba} />,
      );
    });
    expect(tree).toBeDefined();
  });

  test('renders DetailTranslationList correctly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <DetailTranslationList translations={aruba.translations} />,
      );
    });
    expect(tree).toBeDefined();
  });
});

