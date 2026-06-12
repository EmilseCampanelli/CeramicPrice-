import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CalcStackParams } from './types';
import Step1Screen   from '../screens/calc/Step1Screen';
import Step2Screen   from '../screens/calc/Step2Screen';
import Step3Screen   from '../screens/calc/Step3Screen';
import Step4Screen   from '../screens/calc/Step4Screen';
import ResultsScreen from '../screens/calc/ResultsScreen';

const Stack = createNativeStackNavigator<CalcStackParams>();

export default function CalcStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Step1"   component={Step1Screen   as any} />
      <Stack.Screen name="Step2"   component={Step2Screen   as any} />
      <Stack.Screen name="Step3"   component={Step3Screen   as any} />
      <Stack.Screen name="Step4"   component={Step4Screen   as any} />
      <Stack.Screen name="Results" component={ResultsScreen as any} />
    </Stack.Navigator>
  );
}
