/* eslint-disable react/no-unstable-nested-components */
import {TextInput} from 'react-native';
import React from 'react';
import {Icon, TextField} from '@components';

import {TextInput as TextInputPaper} from 'react-native-paper';
import {useAppTheme} from '@themes';

export type SearchBarProps = {
  onChangeSearch: (query: string) => void;
  searchInputRef: React.ForwardedRef<TextInput>;
  handleOnClosePressed: () => void;
};

const SearchBar = ({
  onChangeSearch,
  searchInputRef,
  handleOnClosePressed,
}: SearchBarProps) => {
  const {theme} = useAppTheme();

  return (
    <TextField
      theme={theme}
      label={'Choose Country'}
      onChangeText={onChangeSearch}
      placeholder="Search here"
      forwardedRef={searchInputRef}
      style={{marginBottom: 16}}
      left={
        <TextInputPaper.Icon
          icon={() => {
            return (
              <Icon
                icon={'magnify'}
                color={theme.colors.inactiveText}
                size="md"
              />
            );
          }}
        />
      }
      right={
        <TextInputPaper.Icon
          icon={() => {
            return (
              <Icon
                icon={'close-circle-outline'}
                size="md"
                color={theme.colors.inactiveText}
              />
            );
          }}
          onPress={handleOnClosePressed}
        />
      }
    />
  );
};

export default SearchBar;
