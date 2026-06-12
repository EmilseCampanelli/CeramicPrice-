import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParams } from './types';
import { createNativeStackNavigator as createAuthStack } from '@react-navigation/native-stack';
import type { AuthStackParams } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BottomTabs from './BottomTabs';
import { useStore } from '../store';

const Root  = createNativeStackNavigator<RootStackParams>();
const Auth  = createAuthStack<AuthStackParams>();

function AuthNavigator() {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Auth.Screen name="Login"    component={LoginScreen    as any} />
      <Auth.Screen name="Register" component={RegisterScreen as any} />
    </Auth.Navigator>
  );
}

export default function RootNavigator() {
  const token = useStore(s => s.token);

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {token ? (
        <Root.Screen name="Main" component={BottomTabs} />
      ) : (
        <Root.Screen name="Auth" component={AuthNavigator} />
      )}
    </Root.Navigator>
  );
}
