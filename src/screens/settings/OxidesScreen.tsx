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
import type { OxidesProps } from '../../navigation/types';

export default function OxidesScreen({ navigation }: OxidesProps) {
  const oxides      = useStore(s => s.oxides);
  const deleteOxide = useStore(s => s.deleteOxide);
  const insets      = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar óxido', `¿Eliminar "${name}"?`,
      () => deleteOxide(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Óxidos"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('OxideForm', {})}
      />
      {oxides.length === 0 ? (
        <EmptyState
          title="Aún no hay óxidos"
          actionLabel="Añadir óxido"
          onAction={() => navigation.navigate('OxideForm', {})}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {oxides.map((oxide, i) => (
              <React.Fragment key={oxide.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('OxideForm', { id: oxide.id })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.colorSwatch, { backgroundColor: oxide.color }]} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{oxide.name}</Text>
                      <Text style={styles.rowMeta}>{oxide.colorDescription}</Text>
                    </View>
                    <Text style={styles.price}>{fmtMoney(oxide.pricePerKg)} /kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(oxide.id, oxide.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>
          <Button variant="secondary" icon="plus" onPress={() => navigation.navigate('OxideForm', {})}>
            Añadir óxido
          </Button>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.paper },
  content:     { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingRight: space.card },
  rowMain:     { flex: 1, flexDirection: 'row', alignItems: 'center', padding: space.card, gap: 12, minHeight: layout.tapMin },
  colorSwatch: { width: 44, height: 44, borderRadius: radius.tile },
  rowText:     { flex: 1, gap: 2 },
  rowName:     { fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  rowMeta:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  price:       { fontFamily: fonts.serif, fontSize: 15, color: colors.terra },
  deleteBtn:   { padding: 8 },
});
