import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius } from '../../theme';
import { Button, Icon } from '../../components';
import FormHeader from '../../components/FormHeader';
import { useStore } from '../../store';
import type { LaborRatesProps } from '../../navigation/types';
import type { DifficultyLevel } from '../../types';
import type { IconName } from '../../components';
import { TextInput } from 'react-native';

const LEVELS: { level: DifficultyLevel; label: string; icon: IconName; color: string }[] = [
  { level: 'easy',     label: 'Fácil',     icon: 'check',  color: colors.sage      },
  { level: 'medium',   label: 'Media',     icon: 'layers', color: colors.clayDark  },
  { level: 'hard',     label: 'Difícil',   icon: 'flame',  color: colors.terra     },
  { level: 'artistic', label: 'Artística', icon: 'spark',  color: colors.terraDeep },
];

export default function LaborRatesScreen({ navigation }: LaborRatesProps) {
  const rates           = useStore(s => s.laborRates);
  const updateLaborRate = useStore(s => s.updateLaborRate);
  const insets          = useSafeAreaInsets();

  const [values, setValues] = useState<Record<DifficultyLevel, string>>(
    Object.fromEntries(rates.map(r => [r.level, String(r.price)])) as Record<DifficultyLevel, string>
  );

  const handleSave = () => {
    LEVELS.forEach(({ level }) => {
      updateLaborRate({ level, price: parseFloat(values[level]) || 0 });
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FormHeader
        title="Tarifas por dificultad"
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map(({ level, label, icon, color }) => (
          <View key={level} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
              <Icon name={icon} size={20} color={color} />
            </View>
            <Text style={styles.levelLabel}>{label}</Text>
            <View style={styles.priceInput}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={styles.input}
                value={values[level]}
                onChangeText={v => setValues(prev => ({ ...prev, [level]: v }))}
                keyboardType="decimal-pad"
                selectTextOnFocus
                selectionColor={colors.terra}
              />
            </View>
          </View>
        ))}

        <Text style={styles.hint}>
          Estas tarifas se aplican en el paso de Mano de obra de la calculadora.
        </Text>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleSave} icon="check">Guardar tarifas</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: 0, paddingTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  iconBox: {
    width: 44, height: 44,
    borderRadius: radius.tile,
    alignItems: 'center', justifyContent: 'center',
  },
  levelLabel: { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingHorizontal: 12,
    height: 44,
    gap: 4,
    minWidth: 90,
  },
  currency: { fontFamily: fonts.mono, fontSize: 14, color: colors.muted },
  input: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    flex: 1,
    textAlign: 'right',
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: space.gap,
    paddingHorizontal: space.screen,
  },
  footer: {
    paddingHorizontal: space.screen,
    paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
