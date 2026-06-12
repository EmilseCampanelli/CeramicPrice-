import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, shadow, layout } from '../../theme';
import { Icon, Card } from '../../components';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { fmtMoney, fmtNumber } from '../../lib/format';
import type { PieceDetailScreenProps } from '../../navigation/types';
import type { DifficultyLevel, PieceCategory } from '../../types';

const DIFF_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Fácil', medium: 'Media', hard: 'Difícil', artistic: 'Artística',
};

const CATEGORY_LABELS: Record<PieceCategory, string> = {
  cup: 'Taza', bowl: 'Bol', plate: 'Plato', vase: 'Jarrón', mug: 'Jarro', other: 'Otra',
};

export default function PieceDetailScreen({ navigation, route }: PieceDetailScreenProps) {
  const insets  = useSafeAreaInsets();
  const pieces  = useStore(s => s.pieces);
  const piece   = pieces.find(p => p.id === route.params.pieceId);

  if (!piece) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={24} color={colors.ink} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalle</Text>
          <View style={{ width: layout.tapMin }} />
        </View>
        <Text style={styles.empty}>Pieza no encontrada.</Text>
      </View>
    );
  }

  const { input, pricing } = piece;
  const pieceLabel = [
    CATEGORY_LABELS[input.category],
    `${input.numFirings} cocción${input.numFirings > 1 ? 'es' : ''}`,
    DIFF_LABELS[input.difficulty],
  ].filter(Boolean).join(' · ');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity hitSlop={8} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.title}>Desglose de precio</Text>
        <View style={{ width: layout.tapMin }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen */}
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Icon name={input.category as any} size={24} color={colors.terra} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryClient}>{input.clientName || 'Sin nombre'}</Text>
            <Text style={styles.summaryMeta}>{pieceLabel}</Text>
          </View>
        </View>

        {/* Desglose */}
        <Card style={styles.receiptCard}>
          <ReceiptRow
            label="Arcilla"
            sub={`${fmtNumber(input.weightKg)} kg`}
            amount={pricing.clay}
          />
          <RowDivider dashed />

          <ReceiptRow
            label="Cocción"
            sub={`${input.numFirings} cocción${input.numFirings > 1 ? 'es' : ''} · ${fmtNumber(pricing.kilnOccupancyPercent)}% carga`}
            amount={pricing.firing}
          />
          <RowDivider dashed />

          {pricing.glazes.map((g, i) => (
            <React.Fragment key={g.glazeId}>
              <ReceiptRow
                label={g.glazeId === 'estimated' ? 'Esmalte (estimado)' : `Esmalte ${g.name}`}
                sub={g.glazeId === 'estimated' ? '30% del costo de arcilla' : ''}
                amount={g.amount}
              />
              {i < pricing.glazes.length - 1 && <RowDivider dashed />}
            </React.Fragment>
          ))}

          {pricing.additives > 0 && (
            <>
              <RowDivider dashed />
              <ReceiptRow label="Aditivos" sub="" amount={pricing.additives} />
            </>
          )}

          <RowDivider dashed />
          <ReceiptRow
            label="Mano de obra"
            sub={`Dificultad: ${DIFF_LABELS[input.difficulty]}`}
            amount={pricing.labor}
          />
          <RowDivider dashed />
          <ReceiptRow
            label="Tasa de fallos"
            sub={`+${input.failureRatePercent}% sobre coste`}
            amount={pricing.failureAdjustment}
          />

          <View style={styles.totalLine} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Coste total</Text>
            <Text style={styles.totalAmount}>{fmtMoney(pricing.totalCost)}</Text>
          </View>
        </Card>

        {/* Precio de venta */}
        <View style={[styles.salePriceBlock, shadow.primary]}>
          <View style={styles.salePriceLeft}>
            <Text style={styles.eyebrow}>PRECIO DE VENTA</Text>
            <Text style={styles.salePrice}>{fmtMoney(pricing.salePrice, 0)}</Text>
          </View>
          <View style={styles.salePriceRight}>
            <Text style={styles.marginLabel}>+{input.marginPercent}% margen</Text>
            <Text style={styles.profitLabel}>{fmtMoney(pricing.salePrice - pricing.totalCost)} beneficio</Text>
          </View>
        </View>
      </ScrollView>
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
  row:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: space.card, paddingVertical: 10, gap: 8 },
  left:   { flex: 1, gap: 2 },
  label:  { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  sub:    { fontFamily: fonts.mono, fontSize: 10.5, color: colors.muted, letterSpacing: 0.2 },
  amount: { fontFamily: fonts.serif, fontSize: 15, color: colors.ink },
});

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  empty:   { fontFamily: fonts.sans, fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: 100 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: space.screen, paddingBottom: 8,
  },
  title: { flex: 1, fontFamily: fonts.serif, fontSize: 20, color: colors.ink, textAlign: 'center', letterSpacing: -0.2 },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },

  summary: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderRadius: radius.card, padding: 14,
    ...shadow.card,
  },
  summaryIcon:   { width: 48, height: 48, borderRadius: radius.tile, backgroundColor: colors.clayLight, alignItems: 'center', justifyContent: 'center' },
  summaryText:   { flex: 1, gap: 3 },
  summaryClient: { fontFamily: fonts.sansSemiBold, fontSize: 15.5, color: colors.ink },
  summaryMeta:   { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },

  receiptCard: { gap: 0, overflow: 'visible' },
  totalLine:   { height: 1.5, backgroundColor: colors.ink, marginHorizontal: space.card, marginTop: 4 },
  totalRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.card, paddingVertical: 12 },
  totalLabel:  { fontFamily: fonts.sansBold, fontSize: 15, color: colors.ink },
  totalAmount: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },

  salePriceBlock: {
    backgroundColor: colors.terra, borderRadius: 22, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  salePriceLeft:  { gap: 4 },
  eyebrow:        { fontFamily: fonts.mono, fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  salePrice:      { fontFamily: fonts.serif, fontSize: 48, color: '#FFFFFF', letterSpacing: -1 },
  salePriceRight: { alignItems: 'flex-end', gap: 4 },
  marginLabel:    { fontFamily: fonts.sansSemiBold, fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  profitLabel:    { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
});
