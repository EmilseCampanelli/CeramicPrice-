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
import type { GlazesProps } from '../../navigation/types';

export default function GlazesScreen({ navigation }: GlazesProps) {
  const glazes      = useStore(s => s.glazes);
  const deleteGlaze = useStore(s => s.deleteGlaze);
  const insets      = useSafeAreaInsets();

  const confirmDelete = (id: string, name: string) => {
    confirmDestructive('Eliminar esmalte', `¿Eliminar "${name}"?`,
      () => deleteGlaze(id).catch(() => Alert.alert('Error', 'No se pudo eliminar.')));
  };

  return (
    <View style={styles.root}>
      <ListHeader
        title="Esmaltes"
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate('GlazeForm', {})}
      />

      {glazes.length === 0 ? (
        <EmptyState
          title="Aún no hay esmaltes"
          actionLabel="Añadir esmalte"
          onAction={() => navigation.navigate('GlazeForm', {})}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            {glazes.map((glaze, i) => (
              <React.Fragment key={glaze.id}>
                {i > 0 && <RowDivider />}
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => navigation.navigate('GlazeForm', { id: glaze.id })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.colorSwatch, { backgroundColor: glaze.color }]} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{glaze.name}</Text>
                      <Text style={styles.rowMeta}>
                        {fmtTemp(glaze.minTempC)} – {fmtTemp(glaze.maxTempC)}
                      </Text>
                    </View>
                    <Text style={styles.price}>{fmtMoney(glaze.pricePerLiter)} /L</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(glaze.id, glaze.name)}
                    hitSlop={8}
                  >
                    <Icon name="trash" size={17} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ))}
          </Card>
          <Button variant="secondary" icon="plus" onPress={() => navigation.navigate('GlazeForm', {})}>
            Añadir esmalte
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
  colorSwatch: { width: 46, height: 46, borderRadius: radius.tile },
  rowText:     { flex: 1, gap: 2 },
  rowName:     { fontFamily: fonts.sansSemiBold, fontSize: 14.5, color: colors.ink },
  rowMeta:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  price:       { fontFamily: fonts.serif, fontSize: 15, color: colors.terra },
  deleteBtn:   { padding: 8 },
});
