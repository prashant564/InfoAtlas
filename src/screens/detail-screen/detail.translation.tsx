import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {Button, Surface} from 'react-native-paper';

import {Translation} from '@services/api';
import {Text} from '@components';
import {useAppTheme} from '@themes';

import {DetailScreenStyles} from './styles';

const COLLAPSED_COUNT = 5;

/**
 * ISO 639-3 codes used by the dataset's `translations`.
 */
export const TRANSLATION_LANGUAGES: Record<string, string> = {
  ara: 'Arabic',
  bre: 'Breton',
  ces: 'Czech',
  cym: 'Welsh',
  deu: 'German',
  est: 'Estonian',
  fin: 'Finnish',
  fra: 'French',
  hrv: 'Croatian',
  hun: 'Hungarian',
  ita: 'Italian',
  jpn: 'Japanese',
  kor: 'Korean',
  nld: 'Dutch',
  per: 'Persian',
  pol: 'Polish',
  por: 'Portuguese',
  rus: 'Russian',
  slk: 'Slovak',
  spa: 'Spanish',
  swe: 'Swedish',
  tur: 'Turkish',
  urd: 'Urdu',
  zho: 'Chinese',
};

export type TranslationRow = {
  code: string;
  language: string;
  common: string;
  official?: string;
};

export const getTranslationRows = (translations: {
  [key: string]: Translation;
}): TranslationRow[] =>
  Object.entries(translations)
    .filter(([, translation]) => !!translation?.common)
    .map(([code, {common, official}]) => ({
      code,
      language: TRANSLATION_LANGUAGES[code] ?? code.toUpperCase(),
      common: common!,
      official: official && official !== common ? official : undefined,
    }))
    .sort((a, b) => a.language.localeCompare(b.language));

export type DetailTranslationList = {
  translations: {[key: string]: Translation};
};

const DetailTranslationList = ({translations}: DetailTranslationList) => {
  const {theme} = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  const rows = useMemo(() => getTranslationRows(translations), [translations]);
  const visibleRows = expanded ? rows : rows.slice(0, COLLAPSED_COUNT);

  const {
    fullWidthContainer,
    sectionTitle,
    translationsCard,
    translationRow,
    translationLanguage,
    translationNames,
  } = DetailScreenStyles(theme);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={fullWidthContainer}>
      <Text
        variant={'titleLarge'}
        style={sectionTitle}
        children={'Translations'}
      />
      <Surface elevation={2} style={translationsCard}>
        {visibleRows.map(({code, language, common, official}) => (
          <View key={code} style={translationRow}>
            <Text
              type={'secondary'}
              variant={'labelLarge'}
              style={translationLanguage}
              children={language}
            />
            <View style={translationNames}>
              <Text variant={'bodyLarge'} children={common} />
              {official && (
                <Text
                  type={'secondary'}
                  variant={'bodySmall'}
                  children={official}
                />
              )}
            </View>
          </View>
        ))}
        {rows.length > COLLAPSED_COUNT && (
          <Button
            mode={'text'}
            textColor={theme.colors.inactiveText}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={() => setExpanded(value => !value)}>
            {expanded ? 'Show less' : `Show all ${rows.length}`}
          </Button>
        )}
      </Surface>
    </View>
  );
};

export default DetailTranslationList;
