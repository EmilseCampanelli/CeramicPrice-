import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { Field, Button, ColorPicker } from '../../components';
import FormHeader from '../../components/FormHeader';
import { useStore } from '../../store';
import type { GlazeFormProps } from '../../navigation/types';

export default function GlazeFormScreen({ route, navigation }: GlazeFormProps) {
  const glazes      = useStore(s => s.glazes);
  const addGlaze    = useStore(s => s.addGlaze);
  const updateGlaze = useStore(s => s.updateGlaze);
  const insets      = useSafeAreaInsets();

  const existing = route.params?.id ? glazes.find(g => g.id === route.params.id) : undefined;

  const [name,       setName]     = useState(existing?.name           ?? '');
  const [color,      setColor]    = useState(existing?.color          ?? '#6E7A5A');
  const [price,      setPrice]    = useState(existing?.pricePerLiter  ? String(existing.pricePerLiter)  : '');
  const [coverage,   setCoverage] = useState(existing?.coverageM2PerL ? String(existing.coverageM2PerL) : '');
  const [minTemp,    setMinTemp]  = useState(existing?.minTempC       ? String(existing.minTempC)       : '');
  const [maxTemp,    setMaxTemp]  = useState(existing?.maxTempC       ? String(existing.maxTempC)       : '');

  const handleSave = () => {
    const data = {
      name, color,
      pricePerLiter:  parseFloat(price)    || 0,
      coverageM2PerL: parseFloat(coverage) || 0.45,
      minTempC: parseFloat(minTemp) || 0,
      maxTempC: parseFloat(maxTemp) || 0,
    };
    if (existing) updateGlaze({ ...data, id: existing.id });
    else          addGlaze(data);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FormHeader
        title={existing ? 'Editar esmalte' : 'Nuevo esmalte'}
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Nombre del esmalte"
          value={name}
          onChangeText={setName}
          placeholder="p. ej. Verde celadón"
        />
        <ColorPicker color={color} name={name || 'Color'} onChange={setColor} />
        <View style={styles.row2}>
          <Field
            label="Precio por litro"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            iconLeft="drop"
            suffix="$"
            style={styles.half}
          />
          <Field
            label="Cobertura"
            value={coverage}
            onChangeText={setCoverage}
            keyboardType="decimal-pad"
            suffix="m²/L"
            style={styles.half}
          />
        </View>
        <View style={styles.row2}>
          <Field
            label="Temp. mínima"
            value={minTemp}
            onChangeText={setMinTemp}
            keyboardType="decimal-pad"
            suffix="°C"
            style={styles.half}
          />
          <Field
            label="Temp. máxima"
            value={maxTemp}
            onChangeText={setMaxTemp}
            keyboardType="decimal-pad"
            suffix="°C"
            style={styles.half}
          />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleSave} icon="check">Guardar esmalte</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row2:    { flexDirection: 'row', gap: 12 },
  half:    { flex: 1 },
  footer:  { paddingHorizontal: space.screen, paddingTop: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
});
