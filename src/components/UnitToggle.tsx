import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme';

type Unit = 'kg' | 'L';

interface Props {
  value: Unit;
  onChange: (u: Unit) => void;
}

export default function UnitToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {(['kg', 'L'] as Unit[]).map((u) => (
        <TouchableOpacity
          key={u}
          style={[styles.option, value === u && styles.active]}
          onPress={() => onChange(u)}
          hitSlop={4}
        >
          <Text style={[styles.label, value === u && styles.labelActive]}>
            {`$ / ${u}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.clayLight,
    borderRadius: radius.pill,
    padding: 3,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: colors.surface,
    elevation: 1,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.muted,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.ink,
  },
});
