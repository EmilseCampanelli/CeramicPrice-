import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { colors, fonts, radius } from '../theme';

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  showValue?: boolean;
  trackColor?: string;
}

export default function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  trackColor = colors.terra,
}: Props) {
  const widthRef = useRef(0);

  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const snap = (v: number) => Math.round(v / step) * step;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  }, []);

  const percent = (value - min) / (max - min);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (widthRef.current === 0) return;
        const x = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, x / widthRef.current));
        onChange(snap(clamp(min + ratio * (max - min))));
      },
      onPanResponderMove: (evt) => {
        if (widthRef.current === 0) return;
        const x = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, x / widthRef.current));
        onChange(snap(clamp(min + ratio * (max - min))));
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {(label || showValue) && (
        <View style={styles.row}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={styles.valueText}>{value}%</Text>}
        </View>
      )}
      <View
        style={styles.track}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: `${percent * 100}%`, backgroundColor: trackColor }]} />
        <View style={[styles.thumb, { left: `${percent * 100}%`, borderColor: trackColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.ink2,
  },
  valueText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.terra,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.clayLight,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: radius.pill,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 2,
    marginLeft: -11,
    top: -8,
    elevation: 3,
    shadowColor: '#2C1E0F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
});
