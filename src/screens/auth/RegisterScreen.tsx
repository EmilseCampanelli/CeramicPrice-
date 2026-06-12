import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space } from '../../theme';
import { Field, Button, Icon } from '../../components';
import { useStore } from '../../store';
import type { RegisterScreenProps } from '../../navigation/types';

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const register = useStore(s => s.register);
  const insets   = useSafeAreaInsets();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name.trim())           { setError('El nombre es requerido.');               return; }
    if (!email.trim())          { setError('El correo es requerido.');                return; }
    if (password.length < 8)    { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (password !== confirm)   { setError('Las contraseñas no coinciden.');          return; }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevron-left" size={22} color={colors.ink} />
          <Text style={styles.backText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Marca */}
        <View style={styles.brand}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <View style={styles.logoCore} />
            </View>
          </View>
          <Text style={styles.wordmark}>Crear cuenta</Text>
          <Text style={styles.tagline}>EMPEZÁ A CALCULAR TUS PIEZAS</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Field
            label="Nombre"
            iconLeft="user"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />
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
          <Field
            label="Confirmar contraseña"
            iconLeft="lock"
            value={confirm}
            onChangeText={setConfirm}
            secure
          />
          <Button onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : 'Crear cuenta'}
          </Button>
        </View>

        {/* Login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Iniciá sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.screen,
    paddingBottom: 40,
    gap: 0,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backText: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink },
  brand: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 10,
  },
  logoOuter: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.terraSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  logoInner: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: colors.terra,
    alignItems: 'center', justifyContent: 'center',
  },
  logoCore: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.terra },
  wordmark: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink, letterSpacing: -0.5 },
  tagline:  { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, color: colors.muted },
  form:     { gap: 14 },
  errorBox: {
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    padding: 12,
  },
  errorText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.error },
  loginRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28,
  },
  loginText: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink2 },
  loginLink: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.terra },
});
