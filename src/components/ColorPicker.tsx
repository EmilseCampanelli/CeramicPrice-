import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors, fonts, radius, space } from '../theme';
import { PanResponder } from 'react-native';

interface Props {
  color: string;
  name?: string;
  onChange: (hex: string) => void;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const val = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * val).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function TrackSlider({
  value, min, max, onChange, gradient,
}: {
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  gradient: React.ReactNode;
}) {
  const widthRef = React.useRef(0);
  const percent = (value - min) / (max - min);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const r = Math.max(0, Math.min(1, x / (widthRef.current || 1)));
        onChange(Math.round(min + r * (max - min)));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const r = Math.max(0, Math.min(1, x / (widthRef.current || 1)));
        onChange(Math.round(min + r * (max - min)));
      },
    })
  ).current;

  return (
    <View
      style={styles.track}
      onLayout={(e: LayoutChangeEvent) => { widthRef.current = e.nativeEvent.layout.width; }}
      {...panResponder.panHandlers}
    >
      <Svg width="100%" height="12" style={StyleSheet.absoluteFill}>
        <Defs>{gradient}</Defs>
        <Rect x="0" y="0" width="100%" height="12" rx="6" fill="url(#grad)" />
      </Svg>
      <View style={[styles.trackThumb, { left: `${percent * 100}%` }]} />
    </View>
  );
}

export default function ColorPicker({ color, name, onChange }: Props) {
  const [hexInput, setHexInput] = useState(color);
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hexInput);
  const safeHex = isValid ? hexInput : color;
  const [h, s, l] = hexToHsl(safeHex);

  const hueGrad = (
    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].map((hv, i) => (
        <Stop key={i} offset={`${(hv / 360) * 100}%`} stopColor={hslToHex(hv, 100, 50)} />
      ))}
    </LinearGradient>
  );

  const lightGrad = (
    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <Stop offset="0%" stopColor="#000000" />
      <Stop offset="50%" stopColor={hslToHex(h, s, 50)} />
      <Stop offset="100%" stopColor="#FFFFFF" />
    </LinearGradient>
  );

  const updateColor = (newH: number, newS: number, newL: number) => {
    const hex = hslToHex(newH, newS, newL);
    setHexInput(hex);
    onChange(hex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.preview, { backgroundColor: safeHex }]} />
        <View style={styles.headerText}>
          {name && <Text style={styles.colorName}>{name}</Text>}
          <Text style={styles.hexLabel}>Color en HEX</Text>
          <TextInput
            style={styles.hexInput}
            value={hexInput}
            onChangeText={(v) => {
              setHexInput(v);
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
            }}
            autoCapitalize="characters"
            maxLength={7}
            selectionColor={colors.terra}
          />
        </View>
      </View>

      <View style={styles.sliders}>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Tono</Text>
          <TrackSlider value={h} min={0} max={360} onChange={(v) => updateColor(v, s, l)} gradient={hueGrad} />
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Claridad</Text>
          <TrackSlider value={l} min={0} max={100} onChange={(v) => updateColor(h, s, v)} gradient={lightGrad} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.gap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  preview: {
    width: 66,
    height: 66,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.line,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  colorName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  hexLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  hexInput: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.clayLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    height: 36,
  },
  sliders: {
    gap: 14,
  },
  sliderRow: {
    gap: 8,
  },
  sliderLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.ink2,
  },
  track: {
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  trackThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.ink,
    marginLeft: -11,
    elevation: 3,
  },
});
