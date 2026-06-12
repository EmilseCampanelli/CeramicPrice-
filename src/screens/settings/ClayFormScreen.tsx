import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { Field, Button } from '../../components';
import FormHeader from '../../components/FormHeader';
import { useStore } from '../../store';
import type { ClayFormProps } from '../../navigation/types';

export default function ClayFormScreen({ route, navigation }: ClayFormProps) {
  const clays      = useStore(s => s.clays);
  const addClay    = useStore(s => s.addClay);
  const updateClay = useStore(s => s.updateClay);
  const insets     = useSafeAreaInsets();

  const existing = route.params?.id ? clays.find(c => c.id === route.params.id) : undefined;

  const [name,    setName]    = useState(existing?.name          ?? '');
  const [price,   setPrice]   = useState(existing?.pricePerKg    ? String(existing.pricePerKg)  : '');
  const [minTemp, setMinTemp] = useState(existing?.minTempC      ? String(existing.minTempC)    : '');
  const [maxTemp, setMaxTemp] = useState(existing?.maxTempC      ? String(existing.maxTempC)    : '');

  const handleSave = () => {
    const data = {
      name,
      pricePerKg: parseFloat(price)   || 0,
      minTempC:   parseFloat(minTemp) || 0,
      maxTempC:   parseFloat(maxTemp) || 0,
    };
    if (existing) updateClay({ ...data, id: existing.id });
    else          addClay(data);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FormHeader
        title={existing ? 'Editar arcilla' : 'Nuevo tipo de arcilla'}
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="p. ej. Gres blanco"
        />
        <Field
          label="Precio por kilo"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          iconLeft="box"
          suffix="$ / kg"
        />
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
        <Button onPress={handleSave} icon="check">Guardar arcilla</Button>
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
