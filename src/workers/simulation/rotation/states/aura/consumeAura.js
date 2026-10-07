function deleteLinkedAuras(aura, element) {
  if (element === 'electro' || element === 'hydro') {
    delete aura.electroCharged;
    delete aura.lunarCharged;
  }

  if (element === 'dendro') {
    delete aura.burning;
  }
}

export function consumeAura(aura, element, gaugeUnits) {
  const state = aura[element];

  const excessGaugeUnits = Math.max(gaugeUnits - state.gauge, 0);
  const remainingAuraUnits = state.gauge -= gaugeUnits;

  if (remainingAuraUnits <= 0) {
    delete aura[element];
    deleteLinkedAuras(aura, element);
  }

  return excessGaugeUnits;
}
