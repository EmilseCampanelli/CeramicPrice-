import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

export default function Eyebrow({ children, color = colors.terra, style }: Props) {
  return (
    <Text style={[styles.text, { color }, style]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 1.1,
    lineHeight: 14,
  },
});
