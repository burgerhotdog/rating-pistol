import { MISC } from '@/data';

export function computeStaminaToUpgradeSkill(gameId, upgradeCosts) {
  const { domains } = MISC[gameId];

  let staminaUsed = 0;
  let moneyAcc = 0;

  if (upgradeCosts.weekly) {
    const { stamina, reward } = domains.weekly;
    const domainTimes = upgradeCosts.weekly / reward.weekly;

    moneyAcc += domainTimes * (reward.money ?? 0);
    staminaUsed += domainTimes * stamina;
  }
  
  if (upgradeCosts.material) {
    const { stamina, reward } = domains.material;
    const domainTimes = upgradeCosts.material / reward.material;

    moneyAcc += domainTimes * (reward.money ?? 0);
    staminaUsed += domainTimes * stamina;
  }
  
  if (upgradeCosts.money) {
    const { stamina, reward } = domains.money;
    const moneyStillNeeded = Math.max(upgradeCosts.money - moneyAcc, 0);
    const domainTimes = moneyStillNeeded / reward.money;

    staminaUsed += domainTimes * stamina;
  }

  return staminaUsed;
}
