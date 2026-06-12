import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParams = {
  Login:    undefined;
  Register: undefined;
};

export type HomeStackParams = {
  Home: undefined;
  PieceDetail: { pieceId: string };
};

export type CalcStackParams = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Step4: undefined;
  Results: undefined;
};

export type SettingsStackParams = {
  SettingsMenu: undefined;
  Kilns: undefined;
  KilnForm: { id?: string };
  Clays: undefined;
  ClayForm: { id?: string };
  Glazes: undefined;
  GlazeForm: { id?: string };
  Oxides: undefined;
  OxideForm: { id?: string };
  Engobes: undefined;
  EngobeForm: { id?: string };
  Pigments: undefined;
  PigmentForm: { id?: string };
  LaborRates: undefined;
};

export type BottomTabsParams = {
  HomeTab: undefined;
  CalcTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParams = {
  Auth: undefined;
  Main: undefined;
};

export type LoginScreenProps    = NativeStackScreenProps<AuthStackParams, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParams, 'Register'>;
export type HomeScreenProps       = NativeStackScreenProps<HomeStackParams, 'Home'>;
export type PieceDetailScreenProps = NativeStackScreenProps<HomeStackParams, 'PieceDetail'>;
export type Step1Props        = NativeStackScreenProps<CalcStackParams, 'Step1'>;
export type Step2Props        = NativeStackScreenProps<CalcStackParams, 'Step2'>;
export type Step3Props        = NativeStackScreenProps<CalcStackParams, 'Step3'>;
export type Step4Props        = NativeStackScreenProps<CalcStackParams, 'Step4'>;
export type ResultsProps      = NativeStackScreenProps<CalcStackParams, 'Results'>;
export type SettingsMenuProps = NativeStackScreenProps<SettingsStackParams, 'SettingsMenu'>;
export type KilnsProps        = NativeStackScreenProps<SettingsStackParams, 'Kilns'>;
export type KilnFormProps     = NativeStackScreenProps<SettingsStackParams, 'KilnForm'>;
export type ClaysProps        = NativeStackScreenProps<SettingsStackParams, 'Clays'>;
export type ClayFormProps     = NativeStackScreenProps<SettingsStackParams, 'ClayForm'>;
export type GlazesProps       = NativeStackScreenProps<SettingsStackParams, 'Glazes'>;
export type GlazeFormProps    = NativeStackScreenProps<SettingsStackParams, 'GlazeForm'>;
export type OxidesProps       = NativeStackScreenProps<SettingsStackParams, 'Oxides'>;
export type OxideFormProps    = NativeStackScreenProps<SettingsStackParams, 'OxideForm'>;
export type EngobesProps      = NativeStackScreenProps<SettingsStackParams, 'Engobes'>;
export type PigmentsProps     = NativeStackScreenProps<SettingsStackParams, 'Pigments'>;
export type LaborRatesProps   = NativeStackScreenProps<SettingsStackParams, 'LaborRates'>;
