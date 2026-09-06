import { MISC } from '@/data';

export function computeStaminaToUpgradeSkill(gameId, upgradeCosts) {
  const { domains } = MISC[gameId];

  let stamina = 0;
  let moneyAcc = 0;

  const weeklyDomainTimes = upgradeCosts.weekly / domains.weekly.reward.weekly;
  stamina += weeklyDomainTimes * domains.weekly.stamina;
  moneyAcc += weeklyDomainTimes * domains.weekly.reward.money;

  const materialDomainTimes = upgradeCosts.material / domains.material.reward.material;
  stamina += materialDomainTimes * domains.material.stamina;
  moneyAcc += materialDomainTimes * domains.material.reward.money;

  const moneyStillNeeded = Math.max(upgradeCosts.money - moneyAcc, 0);
  const moneyDomainTimes = moneyStillNeeded / domains.money.reward.money;
  stamina += moneyDomainTimes * domains.money.stamina;

  return stamina;
}
