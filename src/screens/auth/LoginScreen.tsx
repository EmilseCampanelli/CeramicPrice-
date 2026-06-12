import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space } from '../../theme';
import { Field, Button } from '../../components';
import { useStore } from '../../store';
import type { LoginScreenProps } from '../../navigation/types';

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const login   = useStore(s => s.login);
  const insets  = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingresá tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert('Error al iniciar sesión', e?.message ?? 'Verificá tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Marca */}
        <View style={styles.brand}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <View style={styles.logoCore} />
            </View>
          </View>
          <Text style={styles.wordmark}>CeramicPrice</Text>
          <Text style={styles.tagline}>CALCULA EL PRECIO DE CADA PIEZA</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Field
            label="Correo"
            iconLeft="mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Contraseña"
            iconLeft="lock"
            value={password}
            onChangeText={setPassword}
            secure
          />
          <TouchableOpacity hitSlop={8} style={styles.forgotWrap}>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <Button onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar sesión'}
          </Button>
        </View>

        {/* Registro */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>¿Nuevo en el taller? </Text>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.screen,
    paddingTop: 0,
    paddingBottom: 40,
    justifyContent: 'center',
    gap: 0,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 10,
  },
  logoOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.terraSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: colors.terra,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.terra,
  },
  wordmark: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.muted,
  },
  form: {
    gap: 14,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgot: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  signupText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
  },
  signupLink: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.terra,
  },
});
