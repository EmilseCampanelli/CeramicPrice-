import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { confirmDestructive } from '../../lib/confirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Card, Button, Icon, EmptyState } from '../../components';
import ListHeader from '../../components/ListHeader';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { fmtMoney, fmtTemp } from '../../lib/format';
import type { ClaysProps } from '../../navigation/types';

export default function ClaysScreen({ navigation }: ClaysProps) {
  const clays      = useStore(s => s.clays);
  const deleteClay = useStore(s => s.deleteClay);
  const insets     = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar arcilla', `¿Eliminar "${name}"?`,
      () => deleteClay(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Arcillas"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('ClayForm', {})}
      />

      {clays.length === 0 ? (
        <EmptyState
          title="Aún no hay arcillas"
          subtitle="Añade los tipos de arcilla que usas para calcular el coste de cada pieza."
          actionLabel="Añadir arcilla"
          onAction={() => navigation.navigate('ClayForm', {})}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {clays.map((clay, i) => (
              <React.Fragment key={clay.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('ClayForm', { id: clay.id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconBox}>
                      <Icon name="box" size={18} color={colors.terra} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{clay.name}</Text>
                      <Text style={styles.rowMeta}>
                        {fmtTemp(clay.minTempC)} – {fmtTemp(clay.maxTempC)}
                      </Text>
                    </View>
                    <Text style={styles.price}>{fmtMoney(clay.pricePerKg)} /kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(clay.id, clay.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>
          <Button variant="secondary" icon="plus" onPress={() => navigation.navigate('ClayForm', {})}>
            Añadir arcilla
          </Button>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row:     { flexDirection: 'row', alignItems: 'center', paddingRight: space.card },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: space.card, gap: 12, minHeight: layout.tapMin },
  iconBox: { width: 40, height: 40, borderRadius: radius.tile, backgroundColor: colors.clayLight, alignItems: 'center', justifyContent: 'center' },
  rowText:   { flex: 1, gap: 2 },
  rowName:   { fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  rowMeta:   { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  price:     { fontFamily: fonts.serif, fontSize: 15, color: colors.terra },
  deleteBtn: { padding: 8 },
});
