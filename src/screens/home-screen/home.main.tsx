/* eslint-disable react/no-unstable-nested-components */
import React, {FunctionComponent} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppTheme} from '@themes/getTheme';
import HomePage from './home.page';
import {MyWorldScreen, SettingScreen} from '@screens';

export type HomeScreensList = {
  Home: undefined;
  MyWorld: undefined;
  Settings: undefined;
};

const HomeTabs = createMaterialBottomTabNavigator<HomeScreensList>();

const HomeScreen: FunctionComponent = () => {
  const {theme} = useAppTheme();
  return (
    <HomeTabs.Navigator
      initialRouteName={'Home'}
      shifting={false}
      labeled={true}
      activeColor={theme.appColors.miscBrown}
      inactiveColor={theme.appColors.white__a5}
      barStyle={{
        backgroundColor: theme?.colors.background,
      }}>
      <HomeTabs.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <HomeTabs.Screen
        name="MyWorld"
        component={MyWorldScreen}
        options={{
          title: 'My World',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="earth" color={color} size={24} />
          ),
        }}
      />
      <HomeTabs.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="tune" color={color} size={24} />
          ),
        }}
      />
    </HomeTabs.Navigator>
  );
};

export default HomeScreen;
