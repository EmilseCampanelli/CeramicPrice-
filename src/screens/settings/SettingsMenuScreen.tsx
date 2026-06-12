import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { confirmAction } from '../../lib/confirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, radius, layout } from '../../theme';
import { Eyebrow, Card, Icon } from '../../components';
import RowDivider from '../../components/RowDivider';
import { useStore } from '../../store';
import type { SettingsMenuProps } from '../../navigation/types';
import type { IconName } from '../../components';

export default function SettingsMenuScreen({ navigation }: SettingsMenuProps) {
  const insets      = useSafeAreaInsets();
  const kilns       = useStore(s => s.kilns);
  const clays       = useStore(s => s.clays);
  const glazes      = useStore(s => s.glazes);
  const oxides      = useStore(s => s.oxides);
  const engobes     = useStore(s => s.engobes);
  const pigments    = useStore(s => s.pigments);
  const isLoading   = useStore(s => s.isLoading);
  const currentUser = useStore(s => s.currentUser);
  const logout      = useStore(s => s.logout);

  type SettingsRoute = 'Clays' | 'Glazes' | 'Oxides' | 'Engobes' | 'Pigments' | 'Kilns' | 'LaborRates';

  const MATERIALS: { key: SettingsRoute; icon: IconName | null; label: string; count: number; color: string | null }[] = [
    { key: 'Clays',    icon: 'box',  label: 'Arcillas',  count: clays.length,    color: null      },
    { key: 'Glazes',   icon: null,   label: 'Esmaltes',  count: glazes.length,   color: '#6E7A5A' },
    { key: 'Oxides',   icon: null,   label: 'Óxidos',    count: oxides.length,   color: '#3550A8' },
    { key: 'Engobes',  icon: 'jar',  label: 'Engobes',   count: engobes.length,  color: null      },
    { key: 'Pigments', icon: null,   label: 'Pigmentos', count: pigments.length, color: '#D9A93B' },
  ];

  const EQUIPMENT: { key: SettingsRoute; icon: IconName; label: string; count: number }[] = [
    { key: 'Kilns',      icon: 'flame', label: 'Hornos',                count: kilns.length },
    { key: 'LaborRates', icon: 'clock', label: 'Tarifas por dificultad', count: 4           },
  ];

  const go = (screen: SettingsRoute) => navigation.navigate(screen as any);

  const confirmLogout = () => {
    confirmAction('Cerrar sesión', '¿Seguro que querés salir?', 'Salir', logout);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: layout.tabBar + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera con usuario */}
      <View style={styles.head}>
        <View style={styles.headRow}>
          <View>
            <Eyebrow>Tu taller</Eyebrow>
            <Text style={styles.title}>Ajustes</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(currentUser?.name ?? 'C')[0].toUpperCase()}</Text>
          </View>
        </View>
        {currentUser && (
          <Text style={styles.userEmail}>{currentUser.email}</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.terra} />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      )}

      {/* Materiales */}
      <View style={styles.group}>
        <Eyebrow color={colors.muted} style={styles.groupLabel}>Materiales</Eyebrow>
        <Card>
          {MATERIALS.map((item, i) => (
            <React.Fragment key={item.key}>
              {i > 0 && <RowDivider />}
              <TouchableOpacity style={styles.row} onPress={() => go(item.key)} activeOpacity={0.7}>
                {item.color ? (
                  <View style={[styles.colorSwatch, { backgroundColor: item.color }]} />
                ) : (
                  <View style={styles.iconBox}>
                    <Icon name={item.icon!} size={18} color={colors.terra} />
                  </View>
                )}
                <Text style={styles.rowLabel}>{item.label}</Text>
                {isLoading
                  ? <ActivityIndicator size="small" color={colors.faint} />
                  : <Text style={styles.count}>{item.count}</Text>
                }
                <Icon name="chevron-right" size={16} color={colors.faint} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </Card>
      </View>

      {/* Equipo */}
      <View style={styles.group}>
        <Eyebrow color={colors.muted} style={styles.groupLabel}>Equipo y trabajo</Eyebrow>
        <Card>
          {EQUIPMENT.map((item, i) => (
            <React.Fragment key={item.key}>
              {i > 0 && <RowDivider />}
              <TouchableOpacity style={styles.row} onPress={() => go(item.key)} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                  <Icon name={item.icon} size={18} color={colors.terra} />
                </View>
                <Text style={styles.rowLabel}>{item.label}</Text>
                {isLoading
                  ? <ActivityIndicator size="small" color={colors.faint} />
                  : <Text style={styles.count}>{item.count}</Text>
                }
                <Icon name="chevron-right" size={16} color={colors.faint} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </Card>
      </View>

      {/* Cuenta */}
      <View style={styles.group}>
        <Eyebrow color={colors.muted} style={styles.groupLabel}>Cuenta</Eyebrow>
        <Card>
          <TouchableOpacity style={styles.row} onPress={confirmLogout} activeOpacity={0.7}>
            <View style={[styles.iconBox, styles.iconBoxRed]}>
              <Icon name="x" size={18} color={colors.error} />
            </View>
            <Text style={[styles.rowLabel, styles.rowLabelRed]}>Cerrar sesión</Text>
            <Icon name="chevron-right" size={16} color={colors.faint} />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:      { paddingHorizontal: space.screen, gap: space.gap },
  head:         { gap: 6, marginBottom: 4 },
  headRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title:        { fontFamily: fonts.serif, fontSize: 32, color: colors.ink, letterSpacing: -0.5, lineHeight: 38 },
  userEmail:    { fontFamily: fonts.sans, fontSize: 13, color: colors.muted },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.clay,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText:   { fontFamily: fonts.serif, fontSize: 18, color: colors.terraDark },
  loadingRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  loadingText:  { fontFamily: fonts.sans, fontSize: 13, color: colors.muted },
  group:        { gap: 8 },
  groupLabel:   { marginLeft: 2 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: space.card, paddingVertical: 14,
    gap: 12, minHeight: layout.tapMin,
  },
  iconBox:      { width: 40, height: 40, borderRadius: radius.tile, backgroundColor: colors.clayLight, alignItems: 'center', justifyContent: 'center' },
  iconBoxRed:   { backgroundColor: '#FDECEA' },
  colorSwatch:  { width: 40, height: 40, borderRadius: radius.tile },
  rowLabel:     { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },
  rowLabelRed:  { color: colors.error },
  count:        { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
});
