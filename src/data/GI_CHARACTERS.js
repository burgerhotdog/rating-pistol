const GI_CHARACTERS = {
  // Version 5.4
  "10000109": {
    name: `Yumemizuki Mizuki`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 12736, FIGHT_PROP_ATTACK: 215, FIGHT_PROP_DEFENSE: 757 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  // Version 5.3
  "10000107": {
    name: `Citlali`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 11633, FIGHT_PROP_ATTACK: 126, FIGHT_PROP_DEFENSE: 763 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  "10000108": {
    name: `Lan Yan`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9243, FIGHT_PROP_ATTACK: 250, FIGHT_PROP_DEFENSE: 580 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.6,
    },
  },
  "10000106": {
    name: `Mavuika`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12552, FIGHT_PROP_ATTACK: 358, FIGHT_PROP_DEFENSE: 791 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000007-2": {
    name: `Traveler (Pyro)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 5.2
  "10000104": {
    name: `Chasca`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9796, FIGHT_PROP_ATTACK: 346, FIGHT_PROP_DEFENSE: 614 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000105": {
    name: `Ororon`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9243, FIGHT_PROP_ATTACK: 244, FIGHT_PROP_DEFENSE: 586 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 5.1
  "10000103": {
    name: `Xilonen`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12405, FIGHT_PROP_ATTACK: 275, FIGHT_PROP_DEFENSE: 929 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  // Version 5.0
  "10000100": {
    name: `Kachina`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 11799, FIGHT_PROP_ATTACK: 216, FIGHT_PROP_DEFENSE: 792 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  "10000101": {
    name: `Kinich`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12858, FIGHT_PROP_ATTACK: 332, FIGHT_PROP_DEFENSE: 801 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000102": {
    name: `Mualani`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 15184, FIGHT_PROP_ATTACK: 181, FIGHT_PROP_DEFENSE: 570 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 4.8
  "10000099": {
    name: `Emilie`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 13568, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 730 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 4.7
  "10000098": {
    name: `Clorinde`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12956, FIGHT_PROP_ATTACK: 337, FIGHT_PROP_DEFENSE: 783 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000097": {
    name: `Sethos`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 227, FIGHT_PROP_DEFENSE: 559 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.48,
      "FIGHT_PROP_ATTACK_PERCENT": 0.36,
    },
  },
  "10000095": {
    name: `Sigewinne`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 192, FIGHT_PROP_DEFENSE: 499 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 4.6
  "10000096": {
    name: `Arlecchino`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 13103, FIGHT_PROP_ATTACK: 342, FIGHT_PROP_DEFENSE: 764 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 4.5
  "10000094": {
    name: `Chiori`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 11437, FIGHT_PROP_ATTACK: 322, FIGHT_PROP_DEFENSE: 953 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
      "FIGHT_PROP_ATTACK_PERCENT": 0.12,
    },
  },
  
  // Version 4.4
  "10000092": {
    name: `Gaming`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11418, FIGHT_PROP_ATTACK: 301, FIGHT_PROP_DEFENSE: 702 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000093": {
    name: `Xianyun`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10409, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 572 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  
  // Version 4.3
  "10000090": {
    name: `Chevreuse`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 193, FIGHT_PROP_DEFENSE: 604 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000091": {
    name: `Navia`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12650, FIGHT_PROP_ATTACK: 351, FIGHT_PROP_DEFENSE: 793 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 4.2
  "10000088": {
    name: `Charlotte`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10766, FIGHT_PROP_ATTACK: 173, FIGHT_PROP_DEFENSE: 546 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000089": {
    name: `Furina`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 15307, FIGHT_PROP_ATTACK: 243, FIGHT_PROP_DEFENSE: 695 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 4.1
  "10000087": {
    name: `Neuvillette`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 208, FIGHT_PROP_DEFENSE: 576 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000086": {
    name: `Wriothesley`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 13592, FIGHT_PROP_ATTACK: 310, FIGHT_PROP_DEFENSE: 763 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 4.0
  "10000085": {
    name: `Freminet`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12071, FIGHT_PROP_ATTACK: 254, FIGHT_PROP_DEFENSE: 708 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000083": {
    name: `Lynette`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 231, FIGHT_PROP_DEFENSE: 711 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000084": {
    name: `Lyney`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 11021, FIGHT_PROP_ATTACK: 231, FIGHT_PROP_DEFENSE: 537 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000007-3": {
    name: `Traveler (Hydro)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },

  // Version 3.7
  "10000061": {
    name: `Kirara`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12179, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 546 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.6
  "10000082": {
    name: `Baizhu`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 192, FIGHT_PROP_DEFENSE: 499 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000081": {
    name: `Kaveh`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  // Version 3.5
  "10000079": {
    name: `Dehya`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 15674, FIGHT_PROP_ATTACK: 265, FIGHT_PROP_DEFENSE: 627 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.48,
      "FIGHT_PROP_ATTACK_PERCENT": 0.36,
    },
  },
  "10000080": {
    name: `Mika`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12506, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 713 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.4
  "10000078": {
    name: `Alhaitham`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 313, FIGHT_PROP_DEFENSE: 781 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.6,
      "FIGHT_PROP_ATTACK_PERCENT": 0.24,
    },
  },
  "10000077": {
    name: `Yaoyao`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12288, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.3
  "10000076": {
    name: `Faruzan`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 196, FIGHT_PROP_DEFENSE: 627 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ATTACK_PERCENT": 0.3,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.12,
    },
  },
  "10000075": {
    name: `Wanderer`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10164, FIGHT_PROP_ATTACK: 327, FIGHT_PROP_DEFENSE: 607 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 3.2
  "10000074": {
    name: `Layla`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 11092, FIGHT_PROP_ATTACK: 216, FIGHT_PROP_DEFENSE: 655 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000073": {
    name: `Nahida`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10360, FIGHT_PROP_ATTACK: 298, FIGHT_PROP_DEFENSE: 630 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.6,
      "FIGHT_PROP_ATTACK_PERCENT": 0.24,
    },
  },
  
  // Version 3.1
  "10000072": {
    name: `Candace`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10874, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 682 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000071": {
    name: `Cyno`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12490, FIGHT_PROP_ATTACK: 318, FIGHT_PROP_DEFENSE: 859 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.48,
      "FIGHT_PROP_ATTACK_PERCENT": 0.36,
    },
  },
  "10000070": {
    name: `Nilou`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 15184, FIGHT_PROP_ATTACK: 229, FIGHT_PROP_DEFENSE: 728 },
    weights: {
      "FIGHT_PROP_HP_PERCENT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 3.0
  "10000067": {
    name: `Collei`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 199, FIGHT_PROP_DEFENSE: 600 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
      "FIGHT_PROP_ATTACK_PERCENT": 0.18,
    },
  },
  "10000068": {
    name: `Dori`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 723 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000069": {
    name: `Tighnari`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 10849, FIGHT_PROP_ATTACK: 267, FIGHT_PROP_DEFENSE: 630 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.48,
      "FIGHT_PROP_ATTACK_PERCENT": 0.36,
    },
  },
  "10000007-8": {
    name: `Traveler (Dendro)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
      "FIGHT_PROP_ATTACK_PERCENT": 0.18,
    },
  },
  
  // Version 2.8
  "10000059": {
    name: `Shikanoin Heizou`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10657, FIGHT_PROP_ATTACK: 225, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 2.7
  "10000065": {
    name: `Kuki Shinobu`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12288, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  "10000060": {
    name: `Yelan`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 14450, FIGHT_PROP_ATTACK: 243, FIGHT_PROP_DEFENSE: 547 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 2.6
  "10000066": {
    name: `Kamisato Ayato`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 13715, FIGHT_PROP_ATTACK: 298, FIGHT_PROP_DEFENSE: 768 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 2.5
  "10000058": {
    name: `Yae Miko`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10372, FIGHT_PROP_ATTACK: 339, FIGHT_PROP_DEFENSE: 568 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.48,
      "FIGHT_PROP_ATTACK_PERCENT": 0.36,
    },
  },
  
  // Version 2.4
  "10000063": {
    name: `Shenhe`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12992, FIGHT_PROP_ATTACK: 303, FIGHT_PROP_DEFENSE: 830 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  "10000064": {
    name: `Yun Jin`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10657, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 734 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 1,
    },
  },
  
  // Version 2.3
  "10000057": {
    name: `Arataki Itto`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12858, FIGHT_PROP_ATTACK: 227, FIGHT_PROP_DEFENSE: 959 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
      "FIGHT_PROP_ATTACK_PERCENT": 0.12,
    },
  },
  "10000055": {
    name: `Gorou`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 182, FIGHT_PROP_DEFENSE: 648 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  // Version 2.2
  "10000050": {
    name: `Thoma`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10331, FIGHT_PROP_ATTACK: 201, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 2.1
  "10000062": {
    name: `Aloy`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 10898, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 676 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000056": {
    name: `Kujou Sara`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 195, FIGHT_PROP_DEFENSE: 627 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ATTACK_PERCENT": 0.3,
    },
  },
  "10000052": {
    name: `Raiden Shogun`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12907, FIGHT_PROP_ATTACK: 337, FIGHT_PROP_DEFENSE: 789 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000054": {
    name: `Sangonomiya Kokomi`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 13470, FIGHT_PROP_ATTACK: 234, FIGHT_PROP_DEFENSE: 657 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 2.0
  "10000002": {
    name: `Kamisato Ayaka`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12858, FIGHT_PROP_ATTACK: 342, FIGHT_PROP_DEFENSE: 783 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000053": {
    name: `Sayu`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11853, FIGHT_PROP_ATTACK: 244, FIGHT_PROP_DEFENSE: 744 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000007-7": {
    name: `Traveler (Electro)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000049": {
    name: `Yoimiya`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 10164, FIGHT_PROP_ATTACK: 322, FIGHT_PROP_DEFENSE: 614 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 1.6
  "10000047": {
    name: `Kaedehara Kazuha`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 296, FIGHT_PROP_DEFENSE: 806 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  // Version 1.5
  "10000051": {
    name: `Eula`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 13225, FIGHT_PROP_ATTACK: 342, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000048": {
    name: `Yanfei`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9352, FIGHT_PROP_ATTACK: 240, FIGHT_PROP_DEFENSE: 586 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 1.4
  "10000045": {
    name: `Rosaria`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12288, FIGHT_PROP_ATTACK: 240, FIGHT_PROP_DEFENSE: 709 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 1.3
  "10000046": {
    name: `Hu Tao`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 15522, FIGHT_PROP_ATTACK: 106, FIGHT_PROP_DEFENSE: 876 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
      "FIGHT_PROP_ATTACK_PERCENT": 0.12,
    },
  },
  "10000026": {
    name: `Xiao`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12735, FIGHT_PROP_ATTACK: 349, FIGHT_PROP_DEFENSE: 799 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 1.2
  "10000038": {
    name: `Albedo`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 13225, FIGHT_PROP_ATTACK: 251, FIGHT_PROP_DEFENSE: 876 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  "10000037": {
    name: `Ganyu`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9796, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 630 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 1.1
  "10000039": {
    name: `Diona`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 600 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  "10000033": {
    name: `Tartaglia`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 13103, FIGHT_PROP_ATTACK: 301, FIGHT_PROP_DEFENSE: 814 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000044": {
    name: `Xinyan`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11201, FIGHT_PROP_ATTACK: 248, FIGHT_PROP_DEFENSE: 798 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.24,
    },
  },
  "10000030": {
    name: `Zhongli`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 251, FIGHT_PROP_DEFENSE: 737 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.9,
    },
  },
  
  // Version 1.0
  "10000021": {
    name: `Amber`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9461, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 600 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000014": {
    name: `Barbara`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 159, FIGHT_PROP_DEFENSE: 668 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  "10000024": {
    name: `Beidou`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 13049, FIGHT_PROP_ATTACK: 225, FIGHT_PROP_DEFENSE: 648 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000032": {
    name: `Bennett`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 771 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  "10000036": {
    name: `Chongyun`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 10983, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 648 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000016": {
    name: `Diluc`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12980, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 783 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000031": {
    name: `Fischl`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 9189, FIGHT_PROP_ATTACK: 244, FIGHT_PROP_DEFENSE: 593 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.48,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.36,
    },
  },
  "10000003": {
    name: `Jean`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 239, FIGHT_PROP_DEFENSE: 768 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000015": {
    name: `Kaeya`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 11636, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 791 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000042": {
    name: `Keqing`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 13103, FIGHT_PROP_ATTACK: 322, FIGHT_PROP_DEFENSE: 799 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.48,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.36,
    },
  },
  "10000029": {
    name: `Klee`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10286, FIGHT_PROP_ATTACK: 310, FIGHT_PROP_DEFENSE: 614 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000006": {
    name: `Lisa`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 231, FIGHT_PROP_DEFENSE: 573 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.48,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.36,
    },
  },
  "10000041": {
    name: `Mona`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10409, FIGHT_PROP_ATTACK: 287, FIGHT_PROP_DEFENSE: 653 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ATTACK_PERCENT": 0.3,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.12,
    },
  },
  "10000027": {
    name: `Ningguang`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 573 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000034": {
    name: `Noelle`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12071, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 798 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  "10000035": {
    name: `Qiqi`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 12368, FIGHT_PROP_ATTACK: 287, FIGHT_PROP_DEFENSE: 922 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  "10000020": {
    name: `Razor`,
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000043": {
    name: `Sucrose`,
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9243, FIGHT_PROP_ATTACK: 169, FIGHT_PROP_DEFENSE: 702 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  "10000007-4": {
    name: `Traveler (Anemo)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000007-6": {
    name: `Traveler (Geo)`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  "10000022": {
    name: `Venti`,
    type: "Bow",
    base: { FIGHT_PROP_HP: 10531, FIGHT_PROP_ATTACK: 263, FIGHT_PROP_DEFENSE: 668 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  "10000023": {
    name: `Xiangling`,
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10874, FIGHT_PROP_ATTACK: 225, FIGHT_PROP_DEFENSE: 668 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  "10000025": {
    name: `Xingqiu`,
    type: "Sword",
    base: { FIGHT_PROP_HP: 10222, FIGHT_PROP_ATTACK: 201, FIGHT_PROP_DEFENSE: 757 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
};

export default GI_CHARACTERS;
