import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, radius, space } from '../theme';
import Icon, { IconName } from './Icon';

interface Props {
  icon?: IconName;
  children: React.ReactNode;
  variant?: 'soft' | 'light';
  style?: ViewStyle;
}

export default function InfoBox({ icon = 'info', children, variant = 'soft', style }: Props) {
  const bg = variant === 'soft' ? colors.terraSoft : colors.clayLight;
  const iconColor = variant === 'soft' ? colors.terra : colors.ink2;

  return (
    <View style={[styles.box, { backgroundColor: bg }, style]}>
      <Icon name={icon} size={16} color={iconColor} />
      <Text style={[styles.text, { color: variant === 'soft' ? colors.terraDark : colors.ink2 }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: radius.tile,
    alignItems: 'flex-start',
  },
  text: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});
