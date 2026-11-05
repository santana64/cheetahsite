/** All money inputs/outputs are in k€; calculate before rounding for display. */
export type ForecastMode = "manual" | "budget" | "performance";
export type ForecastInput = {
  initialBudget: number;
  variation: number;
  expenses: number;
  progress: number;
  remaining: number;
  previousVariance: number;
  mode: ForecastMode;
};

export function calculateForecast(input: ForecastInput) {
  const values = [
    input.initialBudget,
    input.variation,
    input.expenses,
    input.progress,
    input.remaining,
    input.previousVariance,
  ];
  if (values.some((v) => !Number.isFinite(v) || Math.abs(v) > 1_000_000)) {
    throw new RangeError("Valeurs finies attendues, limitées à 1 000 000 k€.");
  }
  const budget = input.initialBudget + input.variation;
  if (
    input.initialBudget < 0 ||
    budget < 0 ||
    input.expenses < 0 ||
    input.remaining < 0 ||
    input.progress < 0 ||
    input.progress > 100
  ) {
    throw new RangeError(
      "Budgets, dépenses et reste à faire positifs ou nuls ; avancement entre 0 et 100 %.",
    );
  }
  if (!["manual", "budget", "performance"].includes(input.mode))
    throw new RangeError("Mode inconnu.");
  const earned = (budget * input.progress) / 100;
  const cpi = input.expenses > 0 ? earned / input.expenses : null;
  const budgetRemaining = Math.max(0, budget - earned);
  const remaining =
    input.mode === "manual"
      ? input.remaining
      : input.mode === "budget"
        ? budgetRemaining
        : budgetRemaining === 0
          ? 0
          : cpi !== null && cpi > 0
            ? budgetRemaining / cpi
            : null;
  const forecast = remaining === null ? null : input.expenses + remaining;
  const variance = forecast === null ? null : forecast - budget;
  const ratio =
    budget > 0 && variance !== null ? (variance / budget) * 100 : null;
  const drift = variance === null ? null : variance - input.previousVariance;
  return { budget, earned, cpi, remaining, forecast, variance, ratio, drift };
}

export function sumVisibleCostRows(
  rows: readonly { bad: number; cp: number; e: number }[],
) {
  return rows.reduce(
    (sum, row) => ({
      budget: sum.budget + row.bad,
      forecast: sum.forecast + row.cp,
      variance: sum.variance + row.e,
    }),
    { budget: 0, forecast: 0, variance: 0 },
  );
}
