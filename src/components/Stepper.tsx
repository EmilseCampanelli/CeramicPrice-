import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radius, layout } from '../theme';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  label?: string;
}

export default function Stepper({ value, min = 1, max = 99, onChange, label }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, value <= min && styles.disabled]}
        onPress={() => value > min && onChange(value - 1)}
        hitSlop={8}
      >
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{value}</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      <TouchableOpacity
        style={[styles.btn, value >= max && styles.disabled]}
        onPress={() => value < max && onChange(value + 1)}
        hitSlop={8}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: layout.tapMin,
    height: layout.tapMin,
    borderRadius: radius.input,
    backgroundColor: colors.clayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: fonts.sans,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 24,
  },
  disabled: {
    opacity: 0.36,
  },
  valueWrap: {
    alignItems: 'center',
    minWidth: 32,
  },
  value: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
});
