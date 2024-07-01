/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React, {FunctionComponent} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import {CountryDetailsItem} from '@services/api';

import {
  HomeScreen,
  FavouriteScreen,
  SettingScreen,
  DetailScreen,
} from '@screens';

export type PrimaryParamList = {
  HomeScreen: undefined;
  Lockscreen: undefined;
  DetailScreen: {
    selectedCountry: CountryDetailsItem;
  };
  FavouriteScreen: undefined;
  SettingScreen: undefined;
};

export type PrimaryNavigationProps = NativeStackScreenProps<
  PrimaryParamList,
  'DetailScreen'
>;

export type DetailScreenRouteProp = RouteProp<PrimaryParamList, 'DetailScreen'>;

const Stack = createNativeStackNavigator<PrimaryParamList>();

const PrimaryNavigator: FunctionComponent = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
          animationTypeForReplace: 'pop',
        }}
        initialRouteName={'HomeScreen'}>
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} />
        </>
      </Stack.Navigator>
    </>
  );
};

export default PrimaryNavigator;

const exitRoutes = ['HomeScreen'];

export const canExit = (routeName: string): boolean =>
  exitRoutes.includes(routeName);
