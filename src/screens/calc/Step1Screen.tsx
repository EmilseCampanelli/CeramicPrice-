import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Field, Button, StepDots, Icon, Eyebrow } from '../../components';
import { useStore } from '../../store';
import type { Step1Props } from '../../navigation/types';
import type { PieceCategory } from '../../types';
import type { IconName } from '../../components';

const CATEGORIES: { key: PieceCategory; label: string; icon: IconName }[] = [
  { key: 'cup',   label: 'Taza',   icon: 'cup'   },
  { key: 'bowl',  label: 'Bol',    icon: 'bowl'  },
  { key: 'plate', label: 'Plato',  icon: 'plate' },
  { key: 'vase',  label: 'Jarrón', icon: 'vase'  },
  { key: 'mug',   label: 'Jarro',  icon: 'mug'   },
  { key: 'other', label: 'Otro',   icon: 'other' },
];

export default function Step1Screen({ navigation }: Step1Props) {
  const clays       = useStore(s => s.clays);
  const setDraft    = useStore(s => s.setCalcDraft);
  const draft       = useStore(s => s.calcDraft);
  const insets      = useSafeAreaInsets();

  const [clientName, setClientName] = useState(draft.clientName ?? '');
  const [category,   setCategory]   = useState<PieceCategory>(draft.category ?? 'mug');
  const [height,     setHeight]     = useState(draft.heightCm   ? String(draft.heightCm)  : '');
  const [diameter,   setDiameter]   = useState(draft.diameterCm ? String(draft.diameterCm): '');
  const [clayId,     setClayId]     = useState(draft.clayId     ?? (clays[0]?.id ?? ''));
  const [weight,     setWeight]     = useState(draft.weightKg   ? String(draft.weightKg)  : '');

  const selectedClay = clays.find(c => c.id === clayId);

  const handleNext = () => {
    setDraft({
      clientName,
      category,
      heightCm:   parseFloat(height)   || 0,
      diameterCm: parseFloat(diameter) || 0,
      clayId,
      weightKg:   parseFloat(weight)   || 0,
    });
    navigation.navigate('Step2');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Flow header */}
      <View style={[styles.flowHead, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.flowTitle}>Nueva pieza</Text>
        <TouchableOpacity hitSlop={8} onPress={() => (navigation as any).navigate('HomeTab')}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <StepDots current={1} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Nombre del cliente"
          iconLeft="user"
          value={clientName}
          onChangeText={setClientName}
          placeholder="¿Quién pide la pieza?"
        />

        <View style={styles.section}>
          <Eyebrow color={colors.ink2}>Categoría</Eyebrow>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catTile, active && styles.catTileActive]}
                  onPress={() => setCategory(cat.key)}
                  activeOpacity={0.75}
                >
                  <Icon name={cat.icon} size={22} color={active ? colors.terra : colors.muted} />
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.row2}>
          <Field label="Altura" value={height} onChangeText={setHeight} keyboardType="decimal-pad" suffix="cm" style={styles.half} />
          <Field label="Diámetro" value={diameter} onChangeText={setDiameter} keyboardType="decimal-pad" suffix="cm" style={styles.half} />
        </View>

        {/* Clay selector */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Tipo de arcilla</Text>
          <View style={styles.claySelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clayList}>
              {clays.map(clay => (
                <TouchableOpacity
                  key={clay.id}
                  style={[styles.clayChip, clayId === clay.id && styles.clayChipActive]}
                  onPress={() => setClayId(clay.id)}
                  activeOpacity={0.75}
                >
                  <View style={styles.clayDot} />
                  <Text style={[styles.clayChipText, clayId === clay.id && styles.clayChipTextActive]}>
                    {clay.name}
                  </Text>
                  {clayId === clay.id && (
                    <Text style={styles.clayPrice}>${clay.pricePerKg}/kg</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <Field
          label="Peso de arcilla"
          iconLeft="box"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          suffix="kg"
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleNext} iconRight="chevron-right">Continuar</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  flowHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: space.screen, paddingBottom: 4,
    gap: 0,
  },
  flowTitle: {
    flex: 1, fontFamily: fonts.serif, fontSize: 20,
    color: colors.ink, textAlign: 'center', letterSpacing: -0.2,
  },
  cancelText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  section: { gap: 8 },
  fieldLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.ink2, marginBottom: 2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catTile: {
    width: '30%', flexGrow: 1,
    paddingVertical: 14,
    borderRadius: radius.tile,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  catTileActive: { borderColor: colors.terra, backgroundColor: colors.terraSoft },
  catLabel: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  catLabelActive: { color: colors.terra, fontFamily: fonts.sansSemiBold },
  row2:    { flexDirection: 'row', gap: 12 },
  half:    { flex: 1 },
  claySelector: {
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  clayList: { padding: 8, gap: 6 },
  clayChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    minHeight: layout.tapMin,
  },
  clayChipActive: { backgroundColor: colors.terraSoft },
  clayDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.clay },
  clayChipText: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink2 },
  clayChipTextActive: { color: colors.terra, fontFamily: fonts.sansSemiBold },
  clayPrice: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted },
  footer: {
    paddingHorizontal: space.screen, paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
});
