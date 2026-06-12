import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const STEPS = ['Pieza', 'Cocción', 'Esmaltes', 'Mano de obra'];

interface Props {
  current: 1 | 2 | 3 | 4;
}

export default function StepDots({ current }: Props) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return (
          <View key={step} style={styles.item}>
            <View style={[
              styles.dot,
              active && styles.dotActive,
              done && styles.dotDone,
            ]}>
              {done ? (
                <View style={styles.dotInnerDone} />
              ) : active ? (
                <View style={styles.dotInnerActive} />
              ) : (
                <View style={styles.dotInnerIdle} />
              )}
            </View>
            <Text style={[styles.label, active && styles.labelActive, done && styles.labelDone]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.clay,
    backgroundColor: colors.surface,
  },
  dotActive: {
    borderColor: colors.terra,
    backgroundColor: colors.terraSoft,
  },
  dotDone: {
    borderColor: colors.terra,
    backgroundColor: colors.terra,
  },
  dotInnerIdle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.faint,
  },
  dotInnerActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.terra,
  },
  dotInnerDone: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.faint,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.terra,
  },
  labelDone: {
    color: colors.muted,
  },
});
