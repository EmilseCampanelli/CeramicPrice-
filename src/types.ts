export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'artistic';

export interface Kiln {
  id: string;
  name: string;
  volumeLiters: number;
  maxTempC: number;
  powerKW: number;
  costPerFiring: number;
}

export interface Clay {
  id: string;
  name: string;
  pricePerKg: number;
  minTempC: number;
  maxTempC: number;
}

export interface Glaze {
  id: string;
  name: string;
  color: string;
  pricePerLiter: number;
  coverageM2PerL: number;
  minTempC: number;
  maxTempC: number;
}

export interface Oxide {
  id: string;
  name: string;
  color: string;
  colorDescription: string;
  pricePerKg: number;
}

export interface Engobe {
  id: string;
  name: string;
  color: string;
  pricePerKg?: number;
  pricePerLiter?: number;
  unit: 'kg' | 'L';
}

export interface Pigment {
  id: string;
  name: string;
  color: string;
  pricePerKg?: number;
  pricePerLiter?: number;
  unit: 'kg' | 'L';
}

export interface LaborRate {
  level: DifficultyLevel;
  price: number;
}

export type PieceCategory = 'cup' | 'bowl' | 'plate' | 'vase' | 'mug' | 'other';

export interface GlazeUsage {
  glazeId: string;
  coveragePercent: number;
  layers: number;
}

export interface Additive {
  id: string;
  name: string;
  cost: number;
}

export interface PieceInput {
  clientName: string;
  category: PieceCategory;
  heightCm: number;
  diameterCm: number;
  clayId: string;
  weightKg: number;
  kilnId: string;
  numFirings: 1 | 2 | 3;
  glazes: GlazeUsage[];
  additives: Additive[];
  difficulty: DifficultyLevel;
  failureRatePercent: number;
  marginPercent: number;
}

export interface PricingBreakdown {
  clay: number;
  firing: number;
  glazes: { glazeId: string; name: string; amount: number }[];
  additives: number;
  labor: number;
  subtotal: number;
  failureAdjustment: number;
  totalCost: number;
  salePrice: number;
  estimatedVolumeM3: number;
  kilnOccupancyPercent: number;
}

export interface Piece {
  id: string;
  createdAt: string;
  input: PieceInput;
  pricing: PricingBreakdown;
}
