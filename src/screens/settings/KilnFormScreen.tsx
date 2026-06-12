import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { Field, Button } from '../../components';
import FormHeader from '../../components/FormHeader';
import InfoBox from '../../components/InfoBox';
import { useStore } from '../../store';
import type { KilnFormProps } from '../../navigation/types';

export default function KilnFormScreen({ route, navigation }: KilnFormProps) {
  const kilns     = useStore(s => s.kilns);
  const addKiln   = useStore(s => s.addKiln);
  const updateKiln = useStore(s => s.updateKiln);
  const insets    = useSafeAreaInsets();

  const existing = route.params?.id ? kilns.find(k => k.id === route.params.id) : undefined;

  const [name,          setName]     = useState(existing?.name          ?? '');
  const [volume,        setVolume]   = useState(existing?.volumeLiters  ? String(existing.volumeLiters)  : '');
  const [maxTemp,       setMaxTemp]  = useState(existing?.maxTempC      ? String(existing.maxTempC)      : '');
  const [power,         setPower]    = useState(existing?.powerKW       ? String(existing.powerKW)       : '');
  const [costPerFiring, setCost]     = useState(existing?.costPerFiring ? String(existing.costPerFiring) : '');

  const handleSave = () => {
    const data = {
      name,
      volumeLiters:  parseFloat(volume)        || 0,
      maxTempC:      parseFloat(maxTemp)        || 0,
      powerKW:       parseFloat(power)          || 0,
      costPerFiring: parseFloat(costPerFiring)  || 0,
    };
    if (existing) {
      updateKiln({ ...data, id: existing.id });
    } else {
      addKiln(data);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FormHeader
        title={existing ? 'Editar horno' : 'Nuevo horno'}
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Nombre del horno"
          value={name}
          onChangeText={setName}
          placeholder="p. ej. Horno frontal, grande"
        />

        <View style={styles.row2}>
          <Field
            label="Volumen"
            value={volume}
            onChangeText={setVolume}
            keyboardType="decimal-pad"
            suffix="cm³"
            style={styles.half}
          />
          <Field
            label="Temperatura máx."
            value={maxTemp}
            onChangeText={setMaxTemp}
            keyboardType="decimal-pad"
            suffix="°C"
            style={styles.half}
          />
        </View>

        <View style={styles.row2}>
          <Field
            label="Potencia"
            value={power}
            onChangeText={setPower}
            keyboardType="decimal-pad"
            suffix="kW"
            style={styles.half}
          />
          <Field
            label="Coste por cocción"
            value={costPerFiring}
            onChangeText={setCost}
            keyboardType="decimal-pad"
            suffix="$"
            style={styles.half}
          />
        </View>

        <InfoBox icon="flame" variant="soft">
          El volumen define la ocupación del horno al colocar una pieza en la calculadora.
        </InfoBox>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleSave} icon="check">
          Guardar horno
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  row2:    { flexDirection: 'row', gap: 12 },
  half:    { flex: 1 },
  footer:  {
    paddingHorizontal: space.screen,
    paddingTop: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
