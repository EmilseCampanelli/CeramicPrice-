import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  bg?: string;
  noShadow?: boolean;
}

export default function Card({ children, style, bg = colors.surface, noShadow = false }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: bg }, !noShadow && shadow.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
});
