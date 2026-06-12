import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Button, StepDots, Icon, Card } from '../../components';
import { useStore } from '../../store';
import { estimateVolumeLiters } from '../../lib/pricing';
import { fmtMoney, fmtNumber } from '../../lib/format';
import type { Step2Props } from '../../navigation/types';

export default function Step2Screen({ navigation }: Step2Props) {
  const kilns    = useStore(s => s.kilns);
  const draft    = useStore(s => s.calcDraft);
  const setDraft = useStore(s => s.setCalcDraft);
  const insets   = useSafeAreaInsets();

  const [kilnId,      setKilnId]     = useState(draft.kilnId      ?? (kilns[0]?.id ?? ''));
  const [numFirings,  setNumFirings] = useState<1|2|3>(draft.numFirings ?? 2);

  const selectedKiln  = kilns.find(k => k.id === kilnId);
  const pieceVolLiters = estimateVolumeLiters(draft.heightCm ?? 9.5, draft.diameterCm ?? 7);
  const occupancy      = selectedKiln
    ? (pieceVolLiters / selectedKiln.volumeLiters) * 100
    : 0;
  const pieceVolCm3    = pieceVolLiters * 1000;

  const handleNext = () => {
    setDraft({ kilnId, numFirings });
    navigation.navigate('Step3');
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

      <StepDots current={2} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Kiln selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige un horno</Text>
          {kilns.map(kiln => {
            const active = kilnId === kiln.id;
            return (
              <TouchableOpacity
                key={kiln.id}
                style={[styles.kilnCard, active && styles.kilnCardActive]}
                onPress={() => setKilnId(kiln.id)}
                activeOpacity={0.78}
              >
                <View style={[styles.kilnIcon, active && styles.kilnIconActive]}>
                  <Icon name="flame" size={20} color={active ? '#FFF' : colors.terra} />
                </View>
                <View style={styles.kilnText}>
                  <Text style={[styles.kilnName, active && styles.kilnNameActive]}>{kiln.name}</Text>
                  <Text style={[styles.kilnMeta, active && styles.kilnMetaActive]}>
                    {fmtNumber(kiln.volumeLiters)} L · máx {fmtNumber(kiln.maxTempC)} °C
                  </Text>
                </View>
                <View style={styles.kilnPrice}>
                  <Text style={[styles.kilnCost, active && styles.kilnCostActive]}>
                    {fmtMoney(kiln.costPerFiring)}
                  </Text>
                  <Text style={[styles.kilnCostLabel, active && styles.kilnCostLabelActive]}>
                    /COCCIÓN
                  </Text>
                </View>
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Num firings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Número de cocciones</Text>
          <View style={styles.toggleRow}>
            {([1, 2, 3] as const).map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.toggle, numFirings === n && styles.toggleActive]}
                onPress={() => setNumFirings(n)}
                activeOpacity={0.78}
              >
                <Text style={[styles.toggleNum, numFirings === n && styles.toggleNumActive]}>{n}</Text>
                <Text style={[styles.toggleLabel, numFirings === n && styles.toggleLabelActive]}>
                  {n === 1 ? 'cocción' : 'cocciones'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {numFirings === 2 && (
            <Text style={styles.firingNote}>Bizcocho + esmalte</Text>
          )}
        </View>

        {/* Occupancy card */}
        <Card bg={colors.surfaceWarm} style={styles.occupancyCard}>
          <View style={styles.occupancyRow}>
            <Text style={styles.occLabel}>Volumen estimado de la pieza</Text>
            <View style={styles.occValueWrap}>
              <Text style={styles.occValue}>≈ {Math.round(pieceVolCm3)} cm³</Text>
              <Text style={styles.occNote}>
                de Ø{draft.diameterCm ?? 7} × {draft.heightCm ?? 9.5} cm + 18% embalaje
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.occupancyRow}>
            <Text style={styles.occLabel}>Ocupación del horno</Text>
            <Text style={[styles.occPercent, { color: occupancy < 5 ? colors.sage : colors.terra }]}>
              {occupancy.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(occupancy, 100)}%` }]} />
          </View>
          <Text style={styles.occHint}>
            Una pieza ocupa una fracción de la cámara de {selectedKiln ? fmtNumber(selectedKiln.volumeLiters) : '—'} L — cuece una carga completa para repartir el coste.
          </Text>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Button onPress={handleNext} iconRight="chevron-right" style={styles.nextBtn}>
          Continuar
        </Button>
      </View>
    </KeyboardAvoidingView>
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
  content: { paddingHorizontal: space.screen, gap: space.gap + 4, paddingTop: 4 },
  section: { gap: 10 },
  sectionTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },

  kilnCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1.5, borderColor: colors.line,
    padding: 14,
  },
  kilnCardActive: { borderColor: colors.terra, backgroundColor: colors.terraSoft },
  kilnIcon: {
    width: 40, height: 40, borderRadius: radius.tile,
    backgroundColor: colors.clayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  kilnIconActive: { backgroundColor: colors.terra },
  kilnText: { flex: 1, gap: 2 },
  kilnName: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  kilnNameActive: { color: colors.terraDeep },
  kilnMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  kilnMetaActive: { color: colors.terraDark },
  kilnPrice: { alignItems: 'flex-end', gap: 1 },
  kilnCost: { fontFamily: fonts.serif, fontSize: 16, color: colors.terra },
  kilnCostActive: { color: colors.terraDeep },
  kilnCostLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.faint, letterSpacing: 0.5 },
  kilnCostLabelActive: { color: colors.terraDark },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.faint,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.terra },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.terra },

  toggleRow: { flexDirection: 'row', gap: 10 },
  toggle: {
    flex: 1, paddingVertical: 12, borderRadius: radius.tile,
    backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', gap: 3,
  },
  toggleActive: { backgroundColor: colors.terra, borderColor: colors.terra },
  toggleNum: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  toggleNumActive: { color: '#FFF' },
  toggleLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 0.4, textTransform: 'lowercase' },
  toggleLabelActive: { color: 'rgba(255,255,255,0.8)' },
  firingNote: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, textAlign: 'center' },

  occupancyCard: { gap: 10, padding: space.card },
  occupancyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  occLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.ink2, flex: 1 },
  occValueWrap: { alignItems: 'flex-end', gap: 2 },
  occValue: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink, letterSpacing: -0.2 },
  occNote: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.muted },
  occPercent: { fontFamily: fonts.serif, fontSize: 20, letterSpacing: -0.3 },
  progressTrack: {
    height: 8, borderRadius: 4, backgroundColor: colors.clayLight,
  },
  progressFill: {
    height: 8, borderRadius: 4, backgroundColor: colors.terra,
    minWidth: 4,
  },
  occHint: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, lineHeight: 17 },
  divider: { height: 1, backgroundColor: colors.line },

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
