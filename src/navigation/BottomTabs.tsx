import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabsParams } from './types';
import HomeStack from './HomeStack';
import CalcStack from './CalcStack';
import SettingsStack from './SettingsStack';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator<BottomTabsParams>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab"     component={HomeStack}            />
      <Tab.Screen name="CalcTab"     component={CalcStack}            />
      <Tab.Screen name="SettingsTab" component={SettingsStack}        />
    </Tab.Navigator>
  );
}
