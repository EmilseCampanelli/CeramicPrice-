import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParams } from './types';
import SettingsMenuScreen from '../screens/settings/SettingsMenuScreen';
import KilnsScreen        from '../screens/settings/KilnsScreen';
import KilnFormScreen     from '../screens/settings/KilnFormScreen';
import ClaysScreen        from '../screens/settings/ClaysScreen';
import ClayFormScreen     from '../screens/settings/ClayFormScreen';
import GlazesScreen       from '../screens/settings/GlazesScreen';
import GlazeFormScreen    from '../screens/settings/GlazeFormScreen';
import OxidesScreen       from '../screens/settings/OxidesScreen';
import OxideFormScreen    from '../screens/settings/OxideFormScreen';
import EngobesScreen      from '../screens/settings/EngobesScreen';
import PigmentsScreen     from '../screens/settings/PigmentsScreen';
import { EngobeFormScreen, PigmentFormScreen } from '../screens/settings/SimpleMaterialFormScreen';
import LaborRatesScreen   from '../screens/settings/LaborRatesScreen';

const Stack = createNativeStackNavigator<SettingsStackParams>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="SettingsMenu" component={SettingsMenuScreen as any} />
      <Stack.Screen name="Kilns"        component={KilnsScreen        as any} />
      <Stack.Screen name="KilnForm"     component={KilnFormScreen     as any} />
      <Stack.Screen name="Clays"        component={ClaysScreen        as any} />
      <Stack.Screen name="ClayForm"     component={ClayFormScreen     as any} />
      <Stack.Screen name="Glazes"       component={GlazesScreen       as any} />
      <Stack.Screen name="GlazeForm"    component={GlazeFormScreen    as any} />
      <Stack.Screen name="Oxides"       component={OxidesScreen       as any} />
      <Stack.Screen name="OxideForm"    component={OxideFormScreen    as any} />
      <Stack.Screen name="Engobes"      component={EngobesScreen      as any} />
      <Stack.Screen name="EngobeForm"   component={EngobeFormScreen              } />
      <Stack.Screen name="Pigments"     component={PigmentsScreen     as any} />
      <Stack.Screen name="PigmentForm"  component={PigmentFormScreen             } />
      <Stack.Screen name="LaborRates"   component={LaborRatesScreen   as any} />
    </Stack.Navigator>
  );
}
