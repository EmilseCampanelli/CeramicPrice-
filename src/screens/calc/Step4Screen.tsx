import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Button, StepDots, Icon, Field } from '../../components';
import InfoBox from '../../components/InfoBox';
import { useStore } from '../../store';
import type { Step4Props } from '../../navigation/types';
import type { DifficultyLevel } from '../../types';
import type { IconName } from '../../components';

const LEVELS: { level: DifficultyLevel; label: string; icon: IconName; color: string }[] = [
  { level: 'easy',     label: 'Fácil',     icon: 'check',  color: colors.sage      },
  { level: 'medium',   label: 'Media',     icon: 'layers', color: colors.clayDark  },
  { level: 'hard',     label: 'Difícil',   icon: 'flame',  color: colors.terra     },
  { level: 'artistic', label: 'Artística', icon: 'spark',  color: colors.terraDeep },
];

export default function Step4Screen({ navigation }: Step4Props) {
  const draft    = useStore(s => s.calcDraft);
  const setDraft = useStore(s => s.setCalcDraft);
  const insets   = useSafeAreaInsets();

  const [difficulty,    setDifficulty]    = useState<DifficultyLevel>(draft.difficulty         ?? 'hard');
  const [failureRate,   setFailureRate]   = useState(draft.failureRatePercent ? String(draft.failureRatePercent) : '12');
  const [margin,        setMargin]        = useState(draft.marginPercent      ? String(draft.marginPercent)      : '45');

  const handleNext = () => {
    setDraft({
      difficulty,
      failureRatePercent: parseFloat(failureRate) || 0,
      marginPercent:      parseFloat(margin)      || 0,
    });
    navigation.navigate('Results');
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

      <StepDots current={4} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Difficulty tiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dificultad</Text>
          <View style={styles.tilesRow}>
            {LEVELS.map(({ level, label, icon, color }) => {
              const active = difficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.tile, active && { backgroundColor: color, borderColor: color }]}
                  onPress={() => setDifficulty(level)}
                  activeOpacity={0.78}
                >
                  <Icon name={icon} size={20} color={active ? '#FFF' : color} />
                  <Text style={[styles.tileLabel, active && styles.tileLabelActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.diffNote}>
            <Text style={styles.diffNoteText}>
              Cada nivel define la{' '}
              <Text style={{ color: colors.terra }}>tarifa de mano de obra</Text>
              {' '}de la pieza.
            </Text>
          </View>
        </View>

        {/* Failure + margin */}
        <View style={styles.row2}>
          <Field
            label="Tasa de fallos"
            value={failureRate}
            onChangeText={setFailureRate}
            keyboardType="decimal-pad"
            suffix="%"
            style={styles.half}
          />
          <Field
            label="Margen de beneficio"
            value={margin}
            onChangeText={setMargin}
            keyboardType="decimal-pad"
            suffix="%"
            style={styles.half}
          />
        </View>

        <InfoBox icon="clock" variant="light">
          Ajusta la tarifa de cada nivel de dificultad una vez en Ajustes.
        </InfoBox>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Button onPress={handleNext} iconRight="chevron-right" style={styles.nextBtn}>
          Ver precio
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
  sectionTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },
  tilesRow: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.tile,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    minHeight: layout.tapMin,
  },
  tileLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 0.4, textTransform: 'uppercase' },
  tileLabelActive: { color: '#FFF' },
  diffNote: { paddingTop: 4 },
  diffNoteText: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, lineHeight: 18 },
  row2: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
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
