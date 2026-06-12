import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { confirmDestructive } from '../../lib/confirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Card, Button, Icon, EmptyState } from '../../components';
import ListHeader from '../../components/ListHeader';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import { fmtMoney } from '../../lib/format';
import type { PigmentsProps } from '../../navigation/types';

export default function PigmentsScreen({ navigation }: PigmentsProps) {
  const pigments      = useStore(s => s.pigments);
  const deletePigment = useStore(s => s.deletePigment);
  const insets        = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar pigmento', `¿Eliminar "${name}"?`,
      () => deletePigment(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Pigmentos"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('PigmentForm', {})}
      />
      {pigments.length === 0 ? (
        <EmptyState title="Aún no hay pigmentos" actionLabel="Añadir pigmento" onAction={() => navigation.navigate('PigmentForm', {})} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {pigments.map((p, i) => (
              <React.Fragment key={p.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('PigmentForm', { id: p.id })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.swatch, { backgroundColor: p.color }]} />
                    <Text style={styles.rowName}>{p.name}</Text>
                    <Text style={styles.price}>
                      {fmtMoney(p.pricePerKg ?? p.pricePerLiter ?? 0)} /{p.unit}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(p.id, p.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>
          <Button variant="secondary" icon="plus" onPress={() => navigation.navigate('PigmentForm', {})}>
            Añadir pigmento
          </Button>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: colors.paper },
  content:   { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row:       { flexDirection: 'row', alignItems: 'center', paddingRight: space.card },
  rowMain:   { flex: 1, flexDirection: 'row', alignItems: 'center', padding: space.card, gap: 12, minHeight: layout.tapMin },
  swatch:    { width: 40, height: 40, borderRadius: radius.tile },
  rowName:   { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  price:     { fontFamily: fonts.serif, fontSize: 15, color: colors.terra },
  deleteBtn: { padding: 8 },
});
