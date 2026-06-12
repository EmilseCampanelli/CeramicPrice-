import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View, ActivityIndicator } from 'react-native';
import { colors, fonts, radius, layout, shadow } from '../theme';
import Icon, { IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';

interface Props {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  dashed?: boolean;
}

export default function Button({
  onPress,
  children,
  variant = 'primary',
  icon,
  iconRight,
  disabled,
  loading,
  style,
  textStyle,
  fullWidth = true,
  dashed = false,
}: Props) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDark = variant === 'dark';

  const bgColor = isPrimary
    ? colors.terra
    : isDark
    ? colors.ink
    : 'transparent';

  const borderColor = isSecondary
    ? colors.clay
    : isGhost
    ? 'transparent'
    : 'transparent';

  const textColor = isPrimary || isDark
    ? '#FFFFFF'
    : isSecondary
    ? colors.ink
    : colors.terra;

  const iconColor = isPrimary || isDark ? '#FFFFFF' : isSecondary ? colors.ink2 : colors.terra;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.78}
      style={[
        styles.base,
        { backgroundColor: bgColor, borderColor, width: fullWidth ? '100%' : undefined },
        isSecondary && styles.border,
        dashed && styles.dashed,
        isPrimary && shadow.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && <Icon name={icon} size={18} color={iconColor} />}
          <Text style={[styles.label, { color: textColor }, textStyle]}>{children}</Text>
          {iconRight && <Icon name={iconRight} size={18} color={iconColor} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: layout.fieldHeight,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  border: {
    borderWidth: 1.5,
  },
  dashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.clay,
    backgroundColor: 'transparent',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15.5,
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.48,
  },
});
