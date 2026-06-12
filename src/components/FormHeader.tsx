import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, layout } from '../theme';
import Icon from './Icon';

interface Props {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  saveLabel?: string;
}

export default function FormHeader({ title, onBack, onSave, saveLabel = 'Guardar' }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        hitSlop={8}
        disabled={!onBack}
      >
        {onBack && <Icon name="chevron-left" size={24} color={colors.terra} />}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={onSave} hitSlop={8}>
        <Text style={styles.saveLabel}>{saveLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.screen,
    paddingBottom: 12,
    backgroundColor: colors.paper,
  },
  backBtn: {
    width: layout.tapMin,
    height: layout.tapMin,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  saveBtn: {
    minWidth: layout.tapMin,
    height: layout.tapMin,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  saveLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.terra,
  },
});
