import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParams } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import PieceDetailScreen from '../screens/home/PieceDetailScreen';

const Stack = createNativeStackNavigator<HomeStackParams>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home"        component={HomeScreen as any}        />
      <Stack.Screen name="PieceDetail" component={PieceDetailScreen as any} />
    </Stack.Navigator>
  );
}
