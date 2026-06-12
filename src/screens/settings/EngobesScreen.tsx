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
import type { EngobesProps } from '../../navigation/types';

export default function EngobesScreen({ navigation }: EngobesProps) {
  const engobes      = useStore(s => s.engobes);
  const deleteEngobe = useStore(s => s.deleteEngobe);
  const insets       = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar engobe', `¿Eliminar "${name}"?`,
      () => deleteEngobe(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Engobes"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('EngobeForm', {})}
      />
      {engobes.length === 0 ? (
        <EmptyState title="Aún no hay engobes" actionLabel="Añadir engobe" onAction={() => navigation.navigate('EngobeForm', {})} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {engobes.map((e, i) => (
              <React.Fragment key={e.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('EngobeForm', { id: e.id })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.swatch, { backgroundColor: e.color }]} />
                    <Text style={styles.rowName}>{e.name}</Text>
                    <Text style={styles.price}>
                      {fmtMoney(e.pricePerKg ?? e.pricePerLiter ?? 0)} /{e.unit}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(e.id, e.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>
          <Button variant="secondary" icon="plus" onPress={() => navigation.navigate('EngobeForm', {})}>
            Añadir engobe
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
