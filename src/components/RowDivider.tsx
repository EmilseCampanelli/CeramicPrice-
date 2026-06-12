import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, space } from '../theme';

interface Props { dashed?: boolean }

export default function RowDivider({ dashed }: Props) {
  if (dashed) {
    return (
      <View style={styles.dashedWrap}>
        {Array.from({ length: 60 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>
    );
  }
  return <View style={styles.solid} />;
}

const styles = StyleSheet.create({
  solid: {
    height: 1,
    backgroundColor: colors.line,
    marginHorizontal: space.card,
  },
  dashedWrap: {
    flexDirection: 'row',
    marginHorizontal: space.card,
    marginVertical: 2,
    overflow: 'hidden',
    height: 1,
    gap: 3,
  },
  dash: {
    width: 4,
    height: 1,
    backgroundColor: colors.clay,
  },
});
