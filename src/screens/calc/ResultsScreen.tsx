import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, shadow, layout } from '../../theme';
import { Button, Icon, Card } from '../../components';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { calculatePrice } from '../../lib/pricing';
import { fmtMoney, fmtNumber } from '../../lib/format';
import type { ResultsProps } from '../../navigation/types';
import type { DifficultyLevel } from '../../types';

const DIFF_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Fácil', medium: 'Media', hard: 'Difícil', artistic: 'Artística',
};

const CATEGORY_LABELS: Record<string, string> = {
  cup: 'Taza', bowl: 'Bol', plate: 'Plato', vase: 'Jarrón', mug: 'Jarro', other: 'Otro',
};

export default function ResultsScreen({ navigation }: ResultsProps) {
  const draft      = useStore(s => s.calcDraft);
  const kilns      = useStore(s => s.kilns);
  const clays      = useStore(s => s.clays);
  const glazesList = useStore(s => s.glazes);
  const laborRates = useStore(s => s.laborRates);
  const savePiece  = useStore(s => s.savePiece);
  const resetDraft = useStore(s => s.resetCalcDraft);
  const insets     = useSafeAreaInsets();

  const kiln       = kilns.find(k => k.id === draft.kilnId)      ?? kilns[0];
  const clay       = clays.find(c => c.id === draft.clayId)      ?? clays[0];
  const laborRate  = laborRates.find(r => r.level === (draft.difficulty ?? 'hard')) ?? laborRates[2];

  const input = {
    clientName:         draft.clientName         ?? '',
    category:           draft.category           ?? 'mug',
    heightCm:           draft.heightCm           ?? 9.5,
    diameterCm:         draft.diameterCm         ?? 7,
    clayId:             draft.clayId             ?? clay?.id ?? '',
    weightKg:           draft.weightKg           ?? 0.42,
    kilnId:             draft.kilnId             ?? kiln?.id ?? '',
    numFirings:         draft.numFirings         ?? 2,
    glazes:             draft.glazes             ?? [],
    additives:          draft.additives          ?? [],
    difficulty:         draft.difficulty         ?? 'hard',
    failureRatePercent: draft.failureRatePercent ?? 12,
    marginPercent:      draft.marginPercent      ?? 45,
  } as const;

  const pricing = useMemo(() => {
    if (!kiln || !clay || !laborRate) return null;
    return calculatePrice(input as any, kiln, clay, glazesList, laborRate);
  }, [input, kiln, clay, glazesList, laborRate]);

  const handleSave = async () => {
    if (!pricing) return;
    try {
      await savePiece(input as any);
      resetDraft();
      (navigation as any).navigate('HomeTab');
    } catch (e: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error al guardar: ${(e as any)?.message ?? 'Intentá de nuevo.'}`);
      } else {
        Alert.alert('Error al guardar', (e as any)?.message ?? 'Intentá de nuevo.');
      }
    }
  };

  if (!pricing) {
    return (
      <View style={styles.root}>
        <Text style={styles.errorText}>Faltan datos para calcular.</Text>
      </View>
    );
  }

  const pieceLabel = [
    CATEGORY_LABELS[input.category],
    clay?.name,
    `${input.numFirings} cocción${input.numFirings > 1 ? 'es' : ''}`,
    DIFF_LABELS[input.difficulty],
  ].filter(Boolean).join(' · ');

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.flowHead, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.flowTitle}>Desglose de precio</Text>
        <View style={{ width: layout.tapMin }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Icon name={input.category as any} size={24} color={colors.terra} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryClient}>{input.clientName || 'Sin nombre'}</Text>
            <Text style={styles.summaryMeta}>{pieceLabel}</Text>
          </View>
        </View>

        {/* Receipt card */}
        <Card style={styles.receiptCard}>
          {/* Clay */}
          <ReceiptRow
            label="Arcilla"
            sub={`${fmtNumber(input.weightKg)} kg × ${fmtMoney(clay?.pricePerKg ?? 0)}/kg`}
            amount={pricing.clay}
          />
          <RowDivider dashed />

          {/* Firing */}
          <ReceiptRow
            label="Cocción"
            sub={`${fmtMoney(kiln?.costPerFiring ?? 0)} × ${input.numFirings} cocc. × ${pricing.kilnOccupancyPercent.toFixed(1)}% carga`}
            amount={pricing.firing}
          />
          <RowDivider dashed />

          {/* Glazes */}
          {pricing.glazes.map((g, i) => (
            <React.Fragment key={g.glazeId}>
              <ReceiptRow
                label={`Esmalte ${g.name}`}
                sub={(() => {
                  const gu = input.glazes.find((u: any) => u.glazeId === g.glazeId);
                  return gu ? `${gu.coveragePercent}% · ${gu.layers} cap${gu.layers > 1 ? 'as' : 'a'}` : '';
                })()}
                amount={g.amount}
              />
              {i < pricing.glazes.length - 1 && <RowDivider dashed />}
            </React.Fragment>
          ))}

          {/* Additives */}
          {input.additives.length > 0 && (
            <>
              <RowDivider dashed />
              <ReceiptRow
                label="Aditivos"
                sub={input.additives.map((a: any) => a.name).filter(Boolean).join(' + ')}
                amount={pricing.additives}
              />
            </>
          )}

          <RowDivider dashed />

          {/* Labor */}
          <ReceiptRow
            label="Mano de obra"
            sub={`Dificultad: ${DIFF_LABELS[input.difficulty]}`}
            amount={pricing.labor}
          />

          <RowDivider dashed />

          {/* Failure */}
          <ReceiptRow
            label="Tasa de fallos"
            sub={`+${input.failureRatePercent}% sobre coste`}
            amount={pricing.failureAdjustment}
          />

          {/* Total line */}
          <View style={styles.totalLine} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Coste total</Text>
            <Text style={styles.totalAmount}>{fmtMoney(pricing.totalCost)}</Text>
          </View>
        </Card>

        {/* Sale price block */}
        <View style={[styles.salePriceBlock, shadow.primary]}>
          <View style={styles.salePriceLeft}>
            <Text style={styles.salePriceEyebrow}>PRECIO DE VENTA SUGERIDO</Text>
            <Text style={styles.salePriceValue}>{fmtMoney(pricing.salePrice, 0)}</Text>
          </View>
          <View style={styles.salePriceRight}>
            <Text style={styles.marginLabel}>+{input.marginPercent}% margen</Text>
            <Text style={styles.profitLabel}>
              {fmtMoney(pricing.salePrice - pricing.totalCost)} beneficio
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Button onPress={handleSave} icon="save" style={styles.nextBtn}>
          Guardar pieza
        </Button>
      </View>
    </View>
  );
}

function ReceiptRow({ label, sub, amount }: { label: string; sub: string; amount: number }) {
  return (
    <View style={receiptStyles.row}>
      <View style={receiptStyles.left}>
        <Text style={receiptStyles.label}>{label}</Text>
        {sub ? <Text style={receiptStyles.sub}>{sub}</Text> : null}
      </View>
      <Text style={receiptStyles.amount}>{fmtMoney(amount)}</Text>
    </View>
  );
}

const receiptStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: space.card,
    paddingVertical: 10,
    gap: 8,
  },
  left:   { flex: 1, gap: 2 },
  label:  { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  sub:    { fontFamily: fonts.mono, fontSize: 10.5, color: colors.muted, letterSpacing: 0.2 },
  amount: { fontFamily: fonts.serif, fontSize: 15, color: colors.ink },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  errorText: { fontFamily: fonts.sans, fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: 100 },
  flowHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: space.screen, paddingBottom: 8,
  },
  flowTitle: { flex: 1, fontFamily: fonts.serif, fontSize: 20, color: colors.ink, textAlign: 'center', letterSpacing: -0.2 },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },

  summary: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 14,
    ...shadow.card,
  },
  summaryIcon: {
    width: 48, height: 48, borderRadius: radius.tile,
    backgroundColor: colors.clayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryText:   { flex: 1, gap: 3 },
  summaryClient: { fontFamily: fonts.sansSemiBold, fontSize: 15.5, color: colors.ink },
  summaryMeta:   { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },

  receiptCard: { gap: 0, overflow: 'visible' },

  totalLine: { height: 1.5, backgroundColor: colors.ink, marginHorizontal: space.card, marginTop: 4 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: space.card, paddingVertical: 12,
  },
  totalLabel:  { fontFamily: fonts.sansBold, fontSize: 15, color: colors.ink },
  totalAmount: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },

  salePriceBlock: {
    backgroundColor: colors.terra,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salePriceLeft:    { gap: 4 },
  salePriceEyebrow: { fontFamily: fonts.mono, fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  salePriceValue:   { fontFamily: fonts.serif, fontSize: 48, color: '#FFFFFF', letterSpacing: -1 },
  salePriceRight:   { alignItems: 'flex-end', gap: 4 },
  marginLabel:      { fontFamily: fonts.sansSemiBold, fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  profitLabel:      { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(255,255,255,0.7)' },

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
