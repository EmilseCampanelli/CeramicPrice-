import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme';
import Icon from '../components/Icon';

const TABS = [
  { route: 'HomeTab',     label: 'Inicio',   icon: 'home'       },
  { route: 'CalcTab',     label: 'Calcular', icon: 'calculator' },
  { route: 'SettingsTab', label: 'Ajustes',  icon: 'settings'   },
] as const;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.bar, { paddingBottom }]}>
      {state.routes.map((route, index) => {
        const tab = TABS.find(t => t.route === route.name);
        if (!tab) return null;
        const focused = state.index === index;
        const isCenter = route.name === 'CalcTab';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        if (isCenter) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.centerWrap} activeOpacity={0.82}>
              <View style={[styles.centerBtn, focused && styles.centerBtnActive, shadow.primary]}>
                <Icon name={tab.icon} size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
            <Icon
              name={tab.icon}
              size={22}
              color={focused ? colors.terra : colors.faint}
              strokeWidth={focused ? 2 : 1.6}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
    minHeight: 44,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    marginTop: -22,
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.terra,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtnActive: {
    backgroundColor: colors.terraDark,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 10.5,
    color: colors.faint,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.terra,
    fontFamily: fonts.sansSemiBold,
  },
});
