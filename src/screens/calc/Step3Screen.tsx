import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Button, StepDots, Icon, Card, Eyebrow, Slider, Stepper } from '../../components';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { fmtMoney } from '../../lib/format';
import type { Step3Props } from '../../navigation/types';
import type { GlazeUsage, Additive } from '../../types';

let _addId = 1;
function nextId() { return String(++_addId); }

export default function Step3Screen({ navigation }: Step3Props) {
  const glazes   = useStore(s => s.glazes);
  const draft    = useStore(s => s.calcDraft);
  const setDraft = useStore(s => s.setCalcDraft);
  const insets   = useSafeAreaInsets();

  const [glazeUsages, setGlazeUsages] = useState<GlazeUsage[]>(
    draft.glazes ?? [
      { glazeId: glazes[0]?.id ?? '', coveragePercent: 100, layers: 2 },
      { glazeId: glazes[1]?.id ?? '', coveragePercent: 35,  layers: 1 },
    ]
  );
  const [additives, setAdditives] = useState<Additive[]>(
    draft.additives ?? [
      { id: '1', name: 'Detalle de lustre dorado', cost: 6.50 },
      { id: '2', name: 'Reserva de cera',          cost: 0.80 },
    ]
  );

  const addGlaze = () => {
    const unused = glazes.find(g => !glazeUsages.some(u => u.glazeId === g.id));
    if (!unused) return;
    setGlazeUsages(prev => [...prev, { glazeId: unused.id, coveragePercent: 50, layers: 1 }]);
  };

  const removeGlaze = (idx: number) => {
    setGlazeUsages(prev => prev.filter((_, i) => i !== idx));
  };

  const updateGlaze = (idx: number, patch: Partial<GlazeUsage>) => {
    setGlazeUsages(prev => prev.map((u, i) => i === idx ? { ...u, ...patch } : u));
  };

  const addAdditive = () => {
    setAdditives(prev => [...prev, { id: nextId(), name: '', cost: 0 }]);
  };

  const removeAdditive = (id: string) => {
    setAdditives(prev => prev.filter(a => a.id !== id));
  };

  const updateAdditive = (id: string, patch: Partial<Additive>) => {
    setAdditives(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const handleNext = () => {
    setDraft({ glazes: glazeUsages, additives });
    navigation.navigate('Step4');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.flowHead, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.flowTitle}>Nueva pieza</Text>
        <TouchableOpacity hitSlop={8} onPress={() => (navigation as any).navigate('HomeTab')}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <StepDots current={3} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Glazes section */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Eyebrow color={colors.ink2}>Esmaltes</Eyebrow>
            <TouchableOpacity onPress={addGlaze} hitSlop={8}>
              <Text style={styles.addLink}>+ Añadir esmalte</Text>
            </TouchableOpacity>
          </View>

          {glazeUsages.map((gu, idx) => {
            const glaze = glazes.find(g => g.id === gu.glazeId);
            return (
              <Card key={idx} style={styles.glazeCard}>
                {/* Header row */}
                <View style={styles.glazeHead}>
                  <View style={[styles.colorDot, { backgroundColor: glaze?.color ?? colors.clay }]} />
                  <Text style={styles.glazeName}>{glaze?.name ?? '—'}</Text>
                  <TouchableOpacity onPress={() => removeGlaze(idx)} hitSlop={8}>
                    <Icon name="trash" size={18} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                {/* Glaze selector (horizontal chips) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.glazeChips}>
                  {glazes.map(g => (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.chip, gu.glazeId === g.id && styles.chipActive]}
                      onPress={() => updateGlaze(idx, { glazeId: g.id })}
                    >
                      <View style={[styles.chipDot, { backgroundColor: g.color }]} />
                      <Text style={[styles.chipText, gu.glazeId === g.id && styles.chipTextActive]}>
                        {g.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <RowDivider />

                <View style={styles.glazeControls}>
                  <Slider
                    label="Cobertura de superficie"
                    value={gu.coveragePercent}
                    onChange={v => updateGlaze(idx, { coveragePercent: v })}
                  />
                </View>

                <RowDivider />

                <View style={styles.glazeControls}>
                  <View style={styles.stepperRow}>
                    <Text style={styles.stepperLabel}>Capas</Text>
                    <Stepper
                      value={gu.layers}
                      min={1}
                      max={5}
                      onChange={v => updateGlaze(idx, { layers: v })}
                      label="capa"
                    />
                  </View>
                </View>
              </Card>
            );
          })}

          {glazeUsages.length === 0 && (
            <Text style={styles.emptyHint}>Todavía no hay esmaltes añadidos.</Text>
          )}
        </View>

        {/* Additives section */}
        <View style={styles.section}>
          <Eyebrow color={colors.ink2}>Aditivos</Eyebrow>
          {additives.length > 0 && (
            <Card>
              {additives.map((add, i) => (
                <React.Fragment key={add.id}>
                  {i > 0 && <RowDivider />}
                  <View style={styles.addRow}>
                    <TextInput
                      style={styles.addName}
                      value={add.name}
                      onChangeText={v => updateAdditive(add.id, { name: v })}
                      placeholder="Nombre del aditivo"
                      placeholderTextColor={colors.faint}
                      selectionColor={colors.terra}
                    />
                    <TextInput
                      style={styles.addCost}
                      value={add.cost ? String(add.cost) : ''}
                      onChangeText={v => updateAdditive(add.id, { cost: parseFloat(v) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="$0,00"
                      placeholderTextColor={colors.faint}
                      selectionColor={colors.terra}
                    />
                    <TouchableOpacity onPress={() => removeAdditive(add.id)} hitSlop={8}>
                      <Icon name="trash" size={16} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              ))}
            </Card>
          )}

          <Button variant="ghost" icon="plus" dashed onPress={addAdditive}>
            Añadir aditivo
          </Button>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Button onPress={handleNext} iconRight="chevron-right" style={styles.nextBtn}>
          Continuar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  flowHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: space.screen, paddingBottom: 4,
  },
  flowTitle: { flex: 1, fontFamily: fonts.serif, fontSize: 20, color: colors.ink, textAlign: 'center', letterSpacing: -0.2 },
  cancelText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addLink: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.terra },
  emptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, textAlign: 'center', padding: 16 },

  glazeCard: { gap: 0, overflow: 'visible' },
  glazeHead: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: space.card, paddingBottom: 8,
  },
  colorDot: { width: 20, height: 20, borderRadius: 10 },
  glazeName: { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  glazeChips: { paddingHorizontal: space.card, paddingBottom: 10, gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
  },
  chipActive: { backgroundColor: colors.terraSoft },
  chipDot: { width: 10, height: 10, borderRadius: 5 },
  chipText: { fontFamily: fonts.sans, fontSize: 12, color: colors.ink2 },
  chipTextActive: { color: colors.terra, fontFamily: fonts.sansSemiBold },
  glazeControls: { padding: space.card, paddingVertical: 12 },
  stepperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepperLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.ink2 },

  addRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: space.card, paddingVertical: 12,
    minHeight: layout.tapMin,
  },
  addName: {
    flex: 1,
    fontFamily: fonts.sans, fontSize: 14, color: colors.ink,
  },
  addCost: {
    fontFamily: fonts.serif, fontSize: 15, color: colors.terra,
    minWidth: 60, textAlign: 'right',
  },

  footer: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: space.screen, paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  backBtn: {
    width: layout.fieldHeight, height: layout.fieldHeight,
    borderRadius: radius.button,
    backgroundColor: colors.clayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  nextBtn: { flex: 1 },
});
