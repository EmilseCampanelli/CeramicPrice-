import type { Kiln, Clay, Glaze, Oxide, Engobe, Pigment, LaborRate, Piece, PieceInput, PricingBreakdown } from '../types';

// ─── Kilns ────────────────────────────────────────────────────────────────────
// Backend: TotalVolumeCm3 | Frontend: volumeLiters  (1 L = 1000 cm³)

export function kilnFromApi(d: any): Kiln {
  return {
    id:           d.id,
    name:         d.name,
    volumeLiters: d.totalVolumeCm3 / 1000,
    maxTempC:     d.maxTemperatureCelsius,
    powerKW:      d.powerKw,
    costPerFiring: d.costPerFiring,
  };
}

export function kilnToApi(k: Omit<Kiln, 'id'>) {
  return {
    name:                  k.name,
    totalVolumeCm3:        k.volumeLiters * 1000,
    maxTemperatureCelsius: k.maxTempC,
    powerKw:               k.powerKW,
    costPerFiring:         k.costPerFiring,
  };
}

// ─── Clays ────────────────────────────────────────────────────────────────────

export function clayFromApi(d: any): Clay {
  return {
    id:         d.id,
    name:       d.name,
    pricePerKg: d.pricePerKg,
    minTempC:   d.firingTemperatureMin,
    maxTempC:   d.firingTemperatureMax,
  };
}

export function clayToApi(c: Omit<Clay, 'id'>) {
  return {
    name:                  c.name,
    pricePerKg:            c.pricePerKg,
    firingTemperatureMin:  c.minTempC,
    firingTemperatureMax:  c.maxTempC,
    shrinkage:             0,
  };
}

// ─── Glazes ───────────────────────────────────────────────────────────────────
// Backend: CoveragePerLiter in cm²/L | Frontend: coverageM2PerL in m²/L
// 1 m² = 10 000 cm²

export function glazeFromApi(d: any): Glaze {
  return {
    id:             d.id,
    name:           d.name,
    color:          d.color,
    pricePerLiter:  d.pricePerLiter,
    coverageM2PerL: d.coveragePerLiter / 10000,
    minTempC:       d.firingTemperatureMin,
    maxTempC:       d.firingTemperatureMax,
  };
}

export function glazeToApi(g: Omit<Glaze, 'id'>) {
  return {
    name:                 g.name,
    color:                g.color,
    pricePerLiter:        g.pricePerLiter,
    coveragePerLiter:     g.coverageM2PerL * 10000,
    firingTemperatureMin: g.minTempC,
    firingTemperatureMax: g.maxTempC,
  };
}

// ─── Simple materials (Oxide / Engobe / Pigment) ─────────────────────────────

export function oxideFromApi(d: any): Oxide {
  return {
    id:               d.id,
    name:             d.name,
    color:            d.color,
    colorDescription: d.colorDescription ?? '',
    pricePerKg:       d.price,
  };
}

export function oxideToApi(o: Omit<Oxide, 'id'>) {
  return {
    name:             o.name,
    color:            o.color,
    colorDescription: o.colorDescription,
    price:            o.pricePerKg,
    unit:             'kg',
  };
}

export function engobeFromApi(d: any): Engobe {
  return {
    id:           d.id,
    name:         d.name,
    color:        d.color,
    unit:         d.unit as 'kg' | 'L',
    pricePerKg:   d.unit === 'kg' ? d.price : undefined,
    pricePerLiter: d.unit === 'L'  ? d.price : undefined,
  };
}

export function engobeToApi(e: Omit<Engobe, 'id'>) {
  return {
    name:  e.name,
    color: e.color,
    price: e.unit === 'kg' ? (e.pricePerKg ?? 0) : (e.pricePerLiter ?? 0),
    unit:  e.unit,
  };
}

export function pigmentFromApi(d: any): Pigment {
  return {
    id:            d.id,
    name:          d.name,
    color:         d.color,
    unit:          d.unit as 'kg' | 'L',
    pricePerKg:    d.unit === 'kg' ? d.price : undefined,
    pricePerLiter: d.unit === 'L'  ? d.price : undefined,
  };
}

export function pigmentToApi(p: Omit<Pigment, 'id'>) {
  return {
    name:  p.name,
    color: p.color,
    price: p.unit === 'kg' ? (p.pricePerKg ?? 0) : (p.pricePerLiter ?? 0),
    unit:  p.unit,
  };
}

// ─── Labor rates ──────────────────────────────────────────────────────────────
// Backend level: "Easy" | "Medium" | "Hard" | "Artistic"
// Frontend level: "easy" | "medium" | "hard" | "artistic"

export function laborRateFromApi(d: any): LaborRate {
  return {
    level: d.level.toLowerCase() as LaborRate['level'],
    price: d.price,
  };
}

export function laborRatesToApi(rates: LaborRate[]) {
  return rates.map(r => ({
    level: capitalize(r.level),
    price: r.price,
  }));
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function surfaceAreaCm2(heightCm: number, diameterCm: number): number {
  const r = diameterCm / 2;
  return Math.PI * r * r + Math.PI * diameterCm * heightCm;
}

export function pieceInputToApi(input: PieceInput) {
  const CATEGORY_LABELS: Record<string, string> = {
    cup: 'Taza', bowl: 'Bol', plate: 'Plato', vase: 'Jarrón', mug: 'Jarro', other: 'Pieza',
  };
  const autoName = `${CATEGORY_LABELS[input.category] ?? 'Pieza'} ${new Date().toLocaleDateString('es-AR')}`;
  return {
    name:               input.clientName?.trim() || autoName,
    category:           capitalize(input.category),
    heightCm:           input.heightCm,
    diameterCm:         input.diameterCm,
    surfaceAreaCm2:     surfaceAreaCm2(input.heightCm, input.diameterCm),
    clayTypeId:         input.clayId,
    clayWeightKg:       input.weightKg,
    kilnId:             input.kilnId,
    numberOfFirings:    input.numFirings,
    laborMinutes:       60,
    difficultyLevel:    capitalize(input.difficulty),
    failureRatePercent: input.failureRatePercent,
    profitMarginPercent: input.marginPercent,
    glazes: input.glazes.map(g => ({
      glazeId:         g.glazeId,
      coveragePercent: g.coveragePercent,
      numberOfCoats:   g.layers,
    })),
    additives: input.additives.map(a => ({
      name:      a.name,
      costTotal: a.cost,
    })),
  };
}

export function pieceFromApi(d: any): Piece {
  const b = d.breakdown;
  const input: PieceInput = {
    clientName:         d.name,
    category:           d.category.toLowerCase() as any,
    heightCm:           d.heightCm,
    diameterCm:         d.diameterCm,
    clayId:             d.clayTypeId,
    weightKg:           d.clayWeightKg,
    kilnId:             d.kilnId,
    numFirings:         d.numberOfFirings as 1 | 2 | 3,
    difficulty:         d.difficultyLevel.toLowerCase() as any,
    failureRatePercent: d.failureRatePercent,
    marginPercent:      d.profitMarginPercent,
    glazes: (d.glazes ?? []).map((g: any) => ({
      glazeId:         g.glazeId,
      coveragePercent: g.coveragePercent,
      layers:          g.numberOfCoats,
    })),
    additives: (d.additives ?? []).map((a: any) => ({
      id:   a.id,
      name: a.name,
      cost: a.costTotal,
    })),
  };

  const pricing: PricingBreakdown = {
    clay:                  b.clayCost,
    firing:                b.kilnCost,
    glazes:                (b.glazeCostPerGlaze ?? []).map((g: any) => ({
      glazeId: g.glazeId,
      name:    g.glazeName,
      amount:  g.cost,
    })),
    additives:             b.additivesCost,
    labor:                 b.laborCost,
    subtotal:              b.rawCost,
    failureAdjustment:     b.failureAdjustedCost - b.rawCost,
    totalCost:             b.failureAdjustedCost,
    salePrice:             b.salePrice,
    estimatedVolumeM3:     (b.pieceVolumeCm3 ?? 0) / 1_000_000,
    kilnOccupancyPercent:  (b.kilnOccupancyRatio ?? 0) * 100,
  };

  return { id: d.id, createdAt: d.createdAt, input, pricing };
}
