import type { PieceInput, PricingBreakdown, Kiln, Clay, Glaze, LaborRate } from '../types';

// ─── Defaults ─────────────────────────────────────────────────────────────────

const CLAY_DENSITY_G_CM3     = 1.8;   // average between earthenware (1.6) and stoneware (2.0)
const VOLUME_PACKING_FACTOR  = 1.18;  // 18% overhead for irregular shapes
const GLAZE_RATIO_OF_CLAY    = 0.30;  // estimate glaze cost as 30% of clay when no glazes specified
const DEFAULT_FAILURE_RATE   = 10;    // %
const DEFAULT_MARGIN         = 40;    // %

// ─── Volume & surface estimation ──────────────────────────────────────────────

export function estimateVolumeLiters(heightCm: number, diameterCm: number): number {
  const r = diameterCm / 2;
  return (Math.PI * r * r * heightCm * VOLUME_PACKING_FACTOR) / 1000;
}

export function estimateSurfaceM2(heightCm: number, diameterCm: number): number {
  const r = diameterCm / 2;
  const lateral = 2 * Math.PI * r * heightCm;
  const base    = Math.PI * r * r;
  return (lateral + base) / 10000;
}

export function estimateWeightKg(heightCm: number, diameterCm: number): number {
  const r = diameterCm / 2;
  const volumeCm3 = Math.PI * r * r * heightCm * VOLUME_PACKING_FACTOR;
  return (volumeCm3 * CLAY_DENSITY_G_CM3) / 1000;
}

// ─── Main pricing function ────────────────────────────────────────────────────

export function calculatePrice(
  input: PieceInput,
  kiln:  Kiln,
  clay:  Clay,
  glazes: Glaze[],
  laborRate: LaborRate,
): PricingBreakdown {
  // ── Apply smart defaults for optional fields ────────────────────────────────
  const weightKg          = input.weightKg > 0
    ? input.weightKg
    : estimateWeightKg(input.heightCm, input.diameterCm);

  const failureRatePercent = input.failureRatePercent > 0
    ? input.failureRatePercent
    : DEFAULT_FAILURE_RATE;

  const marginPercent = input.marginPercent > 0
    ? input.marginPercent
    : DEFAULT_MARGIN;
  // ───────────────────────────────────────────────────────────────────────────

  // 1. Arcilla = peso × precio/kg
  const clayCost = weightKg * clay.pricePerKg;

  // 2. Cocción = (volumen pieza / volumen horno) × costo × nº cocciones
  const pieceVolumeLiters = estimateVolumeLiters(input.heightCm, input.diameterCm);
  const occupancyRatio    = Math.min(pieceVolumeLiters / kiln.volumeLiters, 1);
  const firingCost        = kiln.costPerFiring * occupancyRatio * input.numFirings;

  // 3. Esmaltes — si no se especifican, se estima como % del costo de arcilla
  const surfaceM2 = estimateSurfaceM2(input.heightCm, input.diameterCm);
  let glazeBreakdown: { glazeId: string; name: string; amount: number }[] = [];
  let glazeCost = 0;

  if (input.glazes.length > 0) {
    glazeBreakdown = input.glazes.map(gu => {
      const glaze = glazes.find(g => g.id === gu.glazeId);
      if (!glaze) return { glazeId: gu.glazeId, name: '?', amount: 0 };
      const litersUsed = surfaceM2 * (gu.coveragePercent / 100) * gu.layers * (1 / glaze.coverageM2PerL);
      return { glazeId: gu.glazeId, name: glaze.name, amount: litersUsed * glaze.pricePerLiter };
    });
    glazeCost = glazeBreakdown.reduce((acc, g) => acc + g.amount, 0);
  } else {
    // Estimación cuando no hay esmaltes especificados
    glazeCost = clayCost * GLAZE_RATIO_OF_CLAY;
    glazeBreakdown = [{ glazeId: 'estimated', name: 'Esmalte estimado', amount: glazeCost }];
  }

  // 4. Aditivos = suma de costos declarados
  const additivesCost = input.additives.reduce((acc, a) => acc + a.cost, 0);

  // 5. Mano de obra = tarifa del nivel de dificultad
  const laborCost = laborRate.price;

  // 6. Subtotal
  const subtotal = clayCost + firingCost + glazeCost + additivesCost + laborCost;

  // 7. Ajuste por fallos
  const failureAdjustment = subtotal * (failureRatePercent / 100);

  // 8. Costo total
  const totalCost = subtotal + failureAdjustment;

  // 9. Precio de venta redondeado a múltiplos de 5
  const rawSalePrice = totalCost * (1 + marginPercent / 100);
  const salePrice    = Math.ceil(rawSalePrice / 5) * 5;

  return {
    clay:                 clayCost,
    firing:               firingCost,
    glazes:               glazeBreakdown,
    additives:            additivesCost,
    labor:                laborCost,
    subtotal,
    failureAdjustment,
    totalCost,
    salePrice,
    estimatedVolumeM3:    pieceVolumeLiters / 1000,
    kilnOccupancyPercent: occupancyRatio * 100,
  };
}
