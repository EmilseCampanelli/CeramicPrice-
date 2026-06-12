const esAR = new Intl.NumberFormat('es-AR');
const esARMoney = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esARMoneyRound = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function fmtNumber(n: number): string {
  return esAR.format(n);
}

export function fmtMoney(n: number, decimals = 2): string {
  if (decimals === 0) return `$${esARMoneyRound.format(n)}`;
  return `$${esARMoney.format(n)}`;
}

export function fmtWeight(n: number): string {
  return `${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)} kg`;
}

export function fmtVolume(n: number): string {
  return `${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)} cm³`;
}

export function fmtTemp(n: number): string {
  return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)} °C`;
}

export function fmtPercent(n: number): string {
  return `${n}%`;
}
