import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ViewStyle, TouchableOpacity, TextInputProps,
} from 'react-native';
import { colors, fonts, radius, layout, space } from '../theme';
import Icon, { IconName } from './Icon';

interface Props extends TextInputProps {
  label: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  suffix?: string;
  secure?: boolean;
  style?: ViewStyle;
  error?: string;
}

export default function Field({
  label, iconLeft, iconRight, suffix, secure, style, error, ...rest
}: Props) {
  const [hidden, setHidden] = useState(secure ?? false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.row,
        focused && styles.focused,
        error ? styles.errorBorder : undefined,
      ]}>
        {iconLeft && (
          <View style={styles.iconWrap}>
            <Icon name={iconLeft} size={18} color={focused ? colors.terra : colors.muted} />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            iconLeft ? styles.inputWithIconLeft : undefined,
            (iconRight || suffix || secure) ? styles.inputWithIconRight : undefined,
          ]}
          placeholderTextColor={colors.faint}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.terra}
          {...rest}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        {secure && (
          <TouchableOpacity style={styles.iconWrap} onPress={() => setHidden(h => !h)} hitSlop={8}>
            <Icon name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
        {iconRight && !secure && (
          <View style={styles.iconWrap}>
            <Icon name={iconRight} size={18} color={colors.muted} />
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space.xs,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.ink2,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.fieldHeight,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  focused: {
    borderColor: colors.terra,
  },
  errorBorder: {
    borderColor: '#C0392B',
  },
  iconWrap: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: layout.body,
    color: colors.ink,
    paddingHorizontal: 14,
    height: '100%',
  },
  inputWithIconLeft: {
    paddingLeft: 4,
  },
  inputWithIconRight: {
    paddingRight: 4,
  },
  suffix: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.muted,
    paddingRight: 14,
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#C0392B',
  },
});
