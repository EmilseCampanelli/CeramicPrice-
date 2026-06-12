import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useStore } from './src/store';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';
import { hydrateStore } from './src/store';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParams } from './src/navigation/types';

const linking: LinkingOptions<RootStackParams> = {
  prefixes: [],
  config: {
    screens: {
      Auth: 'login',
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home:        '',
              PieceDetail: 'pieza/:pieceId',
            },
          },
          CalcTab: {
            screens: {
              Step1:   'calc',
              Step2:   'calc/step2',
              Step3:   'calc/step3',
              Step4:   'calc/step4',
              Results: 'calc/results',
            },
          },
          SettingsTab: {
            screens: {
              SettingsMenu: 'ajustes',
              Kilns:        'ajustes/hornos',
              KilnForm:     'ajustes/hornos/form',
              Clays:        'ajustes/arcillas',
              ClayForm:     'ajustes/arcillas/form',
              Glazes:       'ajustes/esmaltes',
              GlazeForm:    'ajustes/esmaltes/form',
              Oxides:       'ajustes/oxidos',
              OxideForm:    'ajustes/oxidos/form',
              Engobes:      'ajustes/engobes',
              EngobeForm:   'ajustes/engobes/form',
              Pigments:     'ajustes/pigmentos',
              PigmentForm:  'ajustes/pigmentos/form',
              LaborRates:   'ajustes/tarifas',
            },
          },
        },
      },
    },
  },
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Newsreader_400Regular,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  const token = useStore(s => s.token);

  useEffect(() => { hydrateStore(); }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
