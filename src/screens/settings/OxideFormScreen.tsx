import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme';
import { Field, Button, ColorPicker } from '../../components';
import FormHeader from '../../components/FormHeader';
import InfoBox from '../../components/InfoBox';
import { useStore } from '../../store';
import type { OxideFormProps } from '../../navigation/types';

export default function OxideFormScreen({ route, navigation }: OxideFormProps) {
  const oxides      = useStore(s => s.oxides);
  const addOxide    = useStore(s => s.addOxide);
  const updateOxide = useStore(s => s.updateOxide);
  const insets      = useSafeAreaInsets();

  const existing = route.params?.id ? oxides.find(o => o.id === route.params.id) : undefined;

  const [name,        setName]       = useState(existing?.name             ?? '');
  const [color,       setColor]      = useState(existing?.color            ?? '#3550A8');
  const [colorDesc,   setColorDesc]  = useState(existing?.colorDescription ?? '');
  const [price,       setPrice]      = useState(existing?.pricePerKg       ? String(existing.pricePerKg) : '');

  const handleSave = () => {
    const data = {
      name, color,
      colorDescription: colorDesc,
      pricePerKg: parseFloat(price) || 0,
    };
    if (existing) updateOxide({ ...data, id: existing.id });
    else          addOxide(data);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FormHeader
        title={existing ? 'Editar óxido' : 'Nuevo óxido'}
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field label="Nombre del óxido" value={name} onChangeText={setName} placeholder="p. ej. Óxido de cobalto" />
        <ColorPicker color={color} name={colorDesc || 'Color'} onChange={setColor} />
        <Field label="Descripción del color" value={colorDesc} onChangeText={setColorDesc} placeholder="p. ej. Azul intenso" />
        <Field
          label="Precio por kilo"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          iconLeft="beaker"
          suffix="$ / kg"
        />
        <InfoBox icon="beaker" variant="light">
          El color guía la receta; el precio por kilo entra en el coste de cada pieza esmaltada.
        </InfoBox>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button onPress={handleSave} icon="check">Guardar óxido</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: space.screen, gap: space.gap, paddingTop: 4 },
  footer:  { paddingHorizontal: space.screen, paddingTop: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
});
