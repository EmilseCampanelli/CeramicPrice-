import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space } from '../../theme';
import { Field, Button, UnitToggle } from '../../components';
import FormHeader from '../../components/FormHeader';
import InfoBox from '../../components/InfoBox';
import { useStore } from '../../store';

type Mode = 'engobe' | 'pigment';

interface Props {
  mode: Mode;
  existingId?: string;
  onDone: () => void;
}

export function SimpleMaterialForm({ mode, existingId, onDone }: Props) {
  const engobes      = useStore(s => s.engobes);
  const pigments     = useStore(s => s.pigments);
  const addEngobe    = useStore(s => s.addEngobe);
  const updateEngobe = useStore(s => s.updateEngobe);
  const addPigment   = useStore(s => s.addPigment);
  const updatePigment = useStore(s => s.updatePigment);
  const insets       = useSafeAreaInsets();

  const list     = mode === 'engobe' ? engobes : pigments;
  const existing = existingId ? list.find((x: any) => x.id === existingId) : undefined;

  const [name,  setName]  = useState((existing as any)?.name  ?? '');
  const [price, setPrice] = useState((existing as any)?.pricePerKg ? String((existing as any).pricePerKg) : '');
  const [unit,  setUnit]  = useState<'kg' | 'L'>((existing as any)?.unit ?? 'kg');

  const typeName = mode === 'engobe' ? 'engobe' : 'pigmento';
  const title    = existing
    ? `Editar ${typeName}`
    : `Nuevo ${typeName}`;

  const handleSave = () => {
    const priceVal = parseFloat(price) || 0;
    const data: any = {
      name,
      color: '#CCCCCC',
      unit,
      pricePerKg:    unit === 'kg' ? priceVal : undefined,
      pricePerLiter: unit === 'L'  ? priceVal : undefined,
    };
    if (existing) {
      if (mode === 'engobe') updateEngobe({ ...data, id: existing.id });
      else                   updatePigment({ ...data, id: existing.id });
    } else {
      if (mode === 'engobe') addEngobe(data);
      else                   addPigment(data);
    }
    onDone();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field label="Nombre" value={name} onChangeText={setName} placeholder={`p. ej. ${typeName} azul`} />

        <View>
          <View style={styles.priceLabel}>
            <Text style={styles.priceLabelText}>Precio</Text>
            <UnitToggle value={unit} onChange={setUnit} />
          </View>
          <Field
            label=""
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            iconLeft="jar"
            suffix={`/ ${unit}`}
          />
        </View>

        <InfoBox icon="jar" variant="light">
          Engobes y pigmentos solo necesitan su precio: elige si lo compras por kilo o por litro.
        </InfoBox>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleSave} icon="check">Guardar {typeName}</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  priceLabel: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  priceLabelText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.ink2 },
  footer: { paddingHorizontal: space.screen, paddingTop: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
});

// ─── Wrapper screens used by navigation ───────────────────────────────────────

export function EngobeFormScreen({ route, navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <FormHeader
        title={route.params?.id ? 'Editar engobe' : 'Nuevo engobe'}
        onBack={() => navigation.goBack()}
      />
      <SimpleMaterialForm
        mode="engobe"
        existingId={route.params?.id}
        onDone={() => navigation.goBack()}
      />
    </View>
  );
}

export function PigmentFormScreen({ route, navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <FormHeader
        title={route.params?.id ? 'Editar pigmento' : 'Nuevo pigmento'}
        onBack={() => navigation.goBack()}
      />
      <SimpleMaterialForm
        mode="pigment"
        existingId={route.params?.id}
        onDone={() => navigation.goBack()}
      />
    </View>
  );
}
