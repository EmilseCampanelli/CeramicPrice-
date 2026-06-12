import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout, shadow } from '../../theme';
import { Eyebrow, Card, Icon } from '../../components';
import { useStore } from '../../store';
import { fmtMoney } from '../../lib/format';
import type { HomeScreenProps } from '../../navigation/types';
import type { PieceCategory } from '../../types';

const CATEGORY_ICON: Record<PieceCategory, any> = {
  cup: 'cup', bowl: 'bowl', plate: 'plate', vase: 'vase', mug: 'mug', other: 'other',
};

const CATEGORY_LABELS: Record<PieceCategory, string> = {
  cup: 'Taza', bowl: 'Bol', plate: 'Plato', vase: 'Jarrón', mug: 'Jarro', other: 'Otra',
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets      = useSafeAreaInsets();
  const pieces      = useStore(s => s.pieces);
  const currentUser = useStore(s => s.currentUser);

  const goCalc = () => {
    (navigation as any).navigate('CalcTab');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: layout.tabBar + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera */}
      <View style={styles.header}>
        <View>
          <Eyebrow>Mi taller</Eyebrow>
          <Text style={styles.title}>{currentUser?.name ?? 'CeramicPrice'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(currentUser?.name ?? 'C')[0].toUpperCase()}</Text>
        </View>
      </View>

      {/* Acción principal */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={goCalc}
        style={[styles.calcCard, shadow.primary]}
      >
        <View style={styles.calcCardInner}>
          <View style={styles.calcIcon}>
            <Icon name="calculator" size={22} color="rgba(255,255,255,0.9)" />
          </View>
          <View style={styles.calcText}>
            <Text style={styles.calcTitle}>Calcular nueva pieza</Text>
            <Text style={styles.calcSub}>Arcilla, cocción, esmalte y mano de obra</Text>
          </View>
          <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
        </View>
      </TouchableOpacity>

      {/* Piezas recientes */}
      <View style={styles.section}>
        <Eyebrow color={colors.ink2}>Piezas recientes</Eyebrow>
        {pieces.length === 0 ? (
          <View style={styles.emptyBox}>
            <Icon name="calculator" size={28} color={colors.faint} />
            <Text style={styles.emptyText}>Todavía no guardaste ninguna pieza.</Text>
            <TouchableOpacity hitSlop={8} onPress={goCalc}>
              <Text style={styles.emptyLink}>Calcular primera pieza →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Card>
            {pieces.slice(0, 8).map((p, i) => (
              <React.Fragment key={p.id}>
                {i > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('PieceDetail', { pieceId: p.id })}
                >
                  <View style={styles.iconBox}>
                    <Icon name={CATEGORY_ICON[p.input.category] ?? 'other'} size={20} color={colors.terra} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowName}>{p.input.clientName || CATEGORY_LABELS[p.input.category] || 'Pieza'}</Text>
                    <Text style={styles.rowMeta}>{CATEGORY_LABELS[p.input.category] ?? p.input.category}</Text>
                  </View>
                  <View style={styles.priceWrap}>
                    <Text style={styles.price}>{fmtMoney(p.pricing.salePrice, 0)}</Text>
                    <Text style={styles.priceLabel}>VENTA</Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.screen,
    gap: space.gap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 38,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.terraDark,
  },
  calcCard: {
    backgroundColor: colors.terra,
    borderRadius: radius.card,
    padding: space.card,
  },
  calcCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calcIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.tile,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcText: {
    flex: 1,
    gap: 3,
  },
  calcTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  calcSub: {
    fontFamily: fonts.sansLight,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  section: {
    gap: 10,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  emptyLink: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.terra,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginHorizontal: space.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.card,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.tile,
    backgroundColor: colors.clayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  rowMeta: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.muted,
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontFamily: fonts.serif,
    fontSize: 17,
    color: colors.terra,
  },
  priceLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.faint,
    letterSpacing: 0.5,
  },
});
