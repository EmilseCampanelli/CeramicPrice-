import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { confirmDestructive } from '../../lib/confirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Card, Button, Icon, EmptyState } from '../../components';
import ListHeader from '../../components/ListHeader';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { fmtMoney, fmtNumber } from '../../lib/format';
import type { KilnsProps } from '../../navigation/types';

export default function KilnsScreen({ navigation }: KilnsProps) {
  const kilns      = useStore(s => s.kilns);
  const deleteKiln = useStore(s => s.deleteKiln);
  const insets     = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar horno', `¿Eliminar "${name}"?`,
      () => deleteKiln(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Hornos"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('KilnForm', {})}
      />

      {kilns.length === 0 ? (
        <EmptyState
          title="Aún no hay hornos"
          subtitle="Añade los hornos donde cueces para que cada pieza refleje su coste real de cocción."
          actionLabel="Añadir tu primer horno"
          actionIcon="plus"
          onAction={() => navigation.navigate('KilnForm', {})}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {kilns.map((kiln, i) => (
              <React.Fragment key={kiln.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('KilnForm', { id: kiln.id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconBox}>
                      <Icon name="flame" size={18} color={colors.terra} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{kiln.name}</Text>
                      <Text style={styles.rowMeta}>
                        {fmtNumber(kiln.volumeLiters)} L · máx {fmtNumber(kiln.maxTempC)} °C · {kiln.powerKW} kW
                      </Text>
                    </View>
                    <View style={styles.priceWrap}>
                      <Text style={styles.price}>{fmtMoney(kiln.costPerFiring)}</Text>
                      <Text style={styles.priceLabel}>/cocción</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(kiln.id, kiln.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>

          <Button
            variant="secondary"
            icon="plus"
            onPress={() => navigation.navigate('KilnForm', {})}
          >
            Añadir horno
          </Button>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: space.card,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.card,
    gap: 12,
    minHeight: layout.tapMin,
  },
  iconBox: {
    width: 40, height: 40,
    borderRadius: radius.tile,
    backgroundColor: colors.clayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText:    { flex: 1, gap: 2 },
  rowName:    { fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  rowMeta:    { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  priceWrap:  { alignItems: 'flex-end', gap: 1 },
  price:      { fontFamily: fonts.serif, fontSize: 16, color: colors.terra },
  priceLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.faint, letterSpacing: 0.3 },
  deleteBtn:  { padding: 8 },
});
