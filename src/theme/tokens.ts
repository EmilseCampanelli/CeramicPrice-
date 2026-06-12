import { Platform } from 'react-native';

export const colors = {
  paper:       '#F6F0E7',
  paperAlt:    '#FBF6EE',
  surface:     '#FFFFFF',
  surfaceWarm: '#FFFCF6',
  terra:       '#C4622D',
  terraDark:   '#A64E20',
  terraDeep:   '#8A3F18',
  terraSoft:   '#F1DCCB',
  clay:        '#E8D5B7',
  clayLight:   '#F1E7D6',
  clayDark:    '#D8BE97',
  ink:         '#2C2C2C',
  ink2:        '#4A453E',
  muted:       '#8C8073',
  faint:       '#B5AB9B',
  line:        'rgba(44,44,44,0.09)',
  sage:        '#5F6B4C',
  error:       '#C0392B',
};

export const fonts = {
  serif: 'Newsreader_500Medium',
  sans:  'HankenGrotesk_500Medium',
  mono:  'SpaceMono_400Regular',
  sansLight:   'HankenGrotesk_400Regular',
  sansSemiBold:'HankenGrotesk_600SemiBold',
  sansBold:    'HankenGrotesk_700Bold',
};

export const radius = {
  tile:   12,
  input:  14,
  button: 16,
  card:   20,
  pill:   999,
};

export const space = {
  screen: 22,
  gap:    16,
  card:   18,
  xs:     4,
  sm:     8,
  md:     12,
  lg:     20,
  xl:     28,
  xxl:    40,
};

export const layout = {
  fieldHeight: 54,
  tapMin:      44,
  tabBar:      86,
  statusClear: 56,
  body:        16.5,
};

const shadowColor = '#2C1E0F';

export const shadow = {
  card: Platform.select({
    android: { elevation: 2 },
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    default: { elevation: 2 },
  }) as object,
  primary: Platform.select({
    android: { elevation: 6 },
    ios: {
      shadowColor: '#C4622D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 12,
    },
    default: { elevation: 6 },
  }) as object,
  subtle: Platform.select({
    android: { elevation: 1 },
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    default: { elevation: 1 },
  }) as object,
};
