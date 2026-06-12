import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme';

export default function PlaceholderScreen({ route, navigation }: any) {
  const title = route.params?.title ?? route.name;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12 },
  back: { position: 'absolute', top: 56, left: 22 },
  backText: { fontFamily: fonts.sans, fontSize: 15, color: colors.terra },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
});
