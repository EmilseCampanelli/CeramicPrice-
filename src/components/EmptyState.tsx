import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { colors, fonts, space } from '../theme';
import Button from './Button';
import { IconName } from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: IconName;
  onAction?: () => void;
}

function HatchedPlaceholder() {
  const lines = [];
  for (let i = -120; i < 240; i += 14) {
    lines.push(
      <Line key={i} x1={i} y1="0" x2={i + 120} y2="120"
        stroke={colors.clay} strokeWidth="1" opacity="0.6" />
    );
  }
  return (
    <Svg width={120} height={120} style={{ borderRadius: 20 }}>
      <Rect width="120" height="120" rx="20" fill={colors.clayLight} />
      {lines}
    </Svg>
  );
}

export default function EmptyState({ title, subtitle, actionLabel, actionIcon = 'plus', onAction }: Props) {
  return (
    <View style={styles.container}>
      <HatchedPlaceholder />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button
          onPress={onAction}
          icon={actionIcon}
          style={styles.btn}
          fullWidth={false}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.screen,
    gap: 16,
    paddingTop: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  btn: {
    marginTop: 4,
    paddingHorizontal: 28,
    width: undefined,
  },
});
