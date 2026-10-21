import {Alert, Image, Linking, ScrollView, Share, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Screen, Text} from '@components';

import {useAppTheme} from '@themes';

import {useAppBoundStore} from '@store/mainStore';
import {CountriesUpdateResult} from '@services/countries';

import {STORE_URL} from '@utils/constants';
import {devLogger} from '@utils/logger';

import {version as appVersion} from '../../../package.json';

import SettingsSection from './settings.section';
import SettingsRow from './settings.row';
import SettingsThemePicker from './settings.themePicker';
import {SettingScreenStyles} from './styles';

const APP_NAME = 'InfoAtlas';

const PRIVACY_POLICY_URL =
  'https://doc-hosting.flycricket.io/infoatlas-privacy-policy/4d26526e-75d4-46f6-9e1f-bfead8dea22d/privacy';
const TERMS_URL =
  'https://doc-hosting.flycricket.io/infoatlas-terms-of-use/5b574c8e-c9aa-4674-9ed1-65f1d1491c28/terms';

type UpdateStatus = 'idle' | 'checking' | CountriesUpdateResult['kind'];

const UPDATE_STATUS_TEXT: Partial<Record<UpdateStatus, string>> = {
  'up-to-date': 'Up to date',
  updated: 'Updated',
  failed: "Couldn't check",
};

/** "2026-10-21" -> "21 Oct 2026" (in the user's locale). */
export const formatDataDate = (date: string | null) => {
  if (!date) {
    return null;
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  // Dates are published as UTC days; don't let the time zone shift them.
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const openUrl = (url: string) => {
  Linking.openURL(url).catch(error =>
    devLogger('SettingScreen openUrl', error, 'fail'),
  );
};

const SettingScreen = () => {
  const {theme} = useAppTheme();
  const {top} = useSafeAreaInsets();
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');

  const {
    countriesDataVersion,
    countriesDataUpdatedAt,
    travelEntries,
    __checkForCountriesUpdate,
    __clearTravelEntries,
  } = useAppBoundStore(state => ({
    countriesDataVersion: state.countriesDataVersion,
    countriesDataUpdatedAt: state.countriesDataUpdatedAt,
    travelEntries: state.travelEntries,
    __checkForCountriesUpdate: state.__checkForCountriesUpdate,
    __clearTravelEntries: state.__clearTravelEntries,
  }));

  const {outerContainer, scrollContent, title, footer, footerLogo} =
    SettingScreenStyles(theme);

  const travelCounts = useMemo(() => {
    const entries = Object.values(travelEntries);
    return {
      total: entries.length,
      visited: entries.filter(entry => entry.status === 'visited').length,
      wishlist: entries.filter(entry => entry.status === 'wishlist').length,
    };
  }, [travelEntries]);

  const checkForUpdates = async () => {
    setUpdateStatus('checking');
    setUpdateStatus(await __checkForCountriesUpdate());
  };

  const confirmClearTravel = () => {
    Alert.alert(
      'Clear travel history?',
      `This removes all ${travelCounts.total} countries from Visited and your Wishlist. This can't be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            __clearTravelEntries();
          },
        },
      ],
    );
  };

  const shareApp = () => {
    Share.share({
      message: `Explore every country in the world with ${APP_NAME}: ${STORE_URL}`,
    }).catch(error => devLogger('SettingScreen shareApp', error, 'fail'));
  };

  const dataDate = formatDataDate(countriesDataUpdatedAt);
  const dataSubtitle = [
    countriesDataVersion > 0 ? `Version ${countriesDataVersion}` : null,
    dataDate ? `Updated ${dataDate}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={outerContainer}>
      <Screen
        preset="fixed"
        unsafe
        statusBarBg={theme.colors.background}
        statusBar={theme.statusBarStyle}>
        <ScrollView
          contentContainerStyle={[scrollContent, {paddingTop: top + 8}]}
          showsVerticalScrollIndicator={false}>
          <Text
            variant={'headlineLarge'}
            accessibilityRole={'header'}
            style={title}
            children={'Settings'}
          />

          <SettingsSection
            title={'Appearance'}
            footer={"System follows your device's light or dark mode."}>
            <SettingsThemePicker />
          </SettingsSection>

          <SettingsSection
            title={'Your data'}
            footer={
              'Your travel history is stored only on this device. Country data works offline and updates automatically.'
            }>
            <SettingsRow
              icon={'database-refresh-outline'}
              title={'Check for country updates'}
              subtitle={dataSubtitle || undefined}
              value={UPDATE_STATUS_TEXT[updateStatus]}
              trailing={updateStatus === 'checking' ? 'loading' : 'none'}
              disabled={updateStatus === 'checking'}
              onPress={checkForUpdates}
            />
            <SettingsRow
              icon={'delete-outline'}
              tone={'danger'}
              title={'Clear travel history'}
              subtitle={
                travelCounts.total > 0
                  ? `${travelCounts.visited} visited · ${travelCounts.wishlist} on wishlist`
                  : 'Nothing to clear yet'
              }
              disabled={travelCounts.total === 0}
              accessibilityHint={'Asks for confirmation first'}
              onPress={confirmClearTravel}
              isLast
            />
          </SettingsSection>

          {STORE_URL && (
            <SettingsSection title={'Support'}>
              <SettingsRow
                icon={'star-outline'}
                tone={'wishlist'}
                title={`Rate ${APP_NAME}`}
                trailing={'external'}
                onPress={() => openUrl(STORE_URL as string)}
              />
              <SettingsRow
                icon={'share-variant-outline'}
                tone={'visited'}
                title={`Share ${APP_NAME}`}
                onPress={shareApp}
                isLast
              />
            </SettingsSection>
          )}

          <SettingsSection
            title={'About'}
            footer={
              'Country data from REST Countries. Flags from Flagpedia. Map from Natural Earth.'
            }>
            <SettingsRow
              icon={'shield-check-outline'}
              title={'Privacy Policy'}
              trailing={'external'}
              accessibilityHint={'Opens in your browser'}
              onPress={() => openUrl(PRIVACY_POLICY_URL)}
            />
            <SettingsRow
              icon={'file-document-outline'}
              title={'Terms of Service'}
              trailing={'external'}
              accessibilityHint={'Opens in your browser'}
              onPress={() => openUrl(TERMS_URL)}
              isLast
            />
          </SettingsSection>

          <View style={footer}>
            <Image
              source={require('../../../assets/bootsplash_logo.png')}
              style={footerLogo}
              accessibilityIgnoresInvertColors
            />
            <Text variant={'titleSmall'} children={APP_NAME} />
            <Text
              type={'secondary'}
              variant={'bodySmall'}
              children={`Version ${appVersion}`}
            />
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
};

export default SettingScreen;
