const GI_CHARACTERS = {
  // Verison 5.4
  [`Yumemizuki Mizuki`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 12736, FIGHT_PROP_ATTACK: 215, FIGHT_PROP_DEFENSE: 757 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },

  // Version 5.3
  [`Citlali`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 11633, FIGHT_PROP_ATTACK: 126, FIGHT_PROP_DEFENSE: 763 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },

  [`Lan Yan`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9243, FIGHT_PROP_ATTACK: 250, FIGHT_PROP_DEFENSE: 580 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.6,
    },
  },
  
  [`Mavuika`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12552, FIGHT_PROP_ATTACK: 358, FIGHT_PROP_DEFENSE: 791 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },

  [`Traveler (Pyro)`]: {
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
  [`Chasca`]: {
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
  
  [`Ororon`]: {
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
  [`Xilonen`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12405, FIGHT_PROP_ATTACK: 275, FIGHT_PROP_DEFENSE: 929 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  // Version 5.0
  [`Kachina`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 11799, FIGHT_PROP_ATTACK: 216, FIGHT_PROP_DEFENSE: 792 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  [`Kinich`]: {
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
  
  [`Mualani`]: {
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
  [`Emilie`]: {
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
  [`Clorinde`]: {
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
  
  [`Sethos`]: {
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
  
  [`Sigewinne`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 192, FIGHT_PROP_DEFENSE: 499 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 4.6
  [`Arlecchino`]: {
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
  [`Chiori`]: {
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
  [`Gaming`]: {
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
  
  [`Xianyun`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10409, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 572 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  
  // Version 4.3
  [`Chevreuse`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 193, FIGHT_PROP_DEFENSE: 604 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Navia`]: {
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
  [`Charlotte`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10766, FIGHT_PROP_ATTACK: 173, FIGHT_PROP_DEFENSE: 546 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Furina`]: {
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
  [`Neuvillette`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 208, FIGHT_PROP_DEFENSE: 576 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Wriothesley`]: {
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
  [`Freminet`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12071, FIGHT_PROP_ATTACK: 254, FIGHT_PROP_DEFENSE: 708 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Lynette`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 231, FIGHT_PROP_DEFENSE: 711 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Lyney`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 11021, FIGHT_PROP_ATTACK: 231, FIGHT_PROP_DEFENSE: 537 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },

  [`Traveler (Hydro)`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 3.8
  
  // Version 3.7
  [`Kirara`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12179, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 546 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.6
  [`Baizhu`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 192, FIGHT_PROP_DEFENSE: 499 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Kaveh`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  // Version 3.5
  [`Dehya`]: {
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
  
  [`Mika`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12506, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 713 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.4
  [`Alhaitham`]: {
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
  
  [`Yaoyao`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12288, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 3.3
  [`Faruzan`]: {
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
  
  [`Wanderer`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10164, FIGHT_PROP_ATTACK: 327, FIGHT_PROP_DEFENSE: 607 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 3.2
  [`Layla`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 11092, FIGHT_PROP_ATTACK: 216, FIGHT_PROP_DEFENSE: 655 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Nahida`]: {
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
  [`Candace`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10874, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 682 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Cyno`]: {
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
  
  [`Nilou`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 15184, FIGHT_PROP_ATTACK: 229, FIGHT_PROP_DEFENSE: 728 },
    weights: {
      "FIGHT_PROP_HP_PERCENT": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  // Version 3.0
  [`Collei`]: {
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
  
  [`Dori`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 723 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Tighnari`]: {
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

  [`Traveler (Dendro)`]: {
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
  [`Shikanoin Heizou`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10657, FIGHT_PROP_ATTACK: 225, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 2.7
  [`Kuki Shinobu`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12288, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  
  [`Yelan`]: {
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
  [`Kamisato Ayato`]: {
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
  [`Yae Miko`]: {
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
  [`Shenhe`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12992, FIGHT_PROP_ATTACK: 303, FIGHT_PROP_DEFENSE: 830 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  
  [`Yun Jin`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10657, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 734 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 1,
    },
  },
  
  // Version 2.3
  [`Arataki Itto`]: {
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
  
  [`Gorou`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 182, FIGHT_PROP_DEFENSE: 648 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  // Version 2.2
  [`Thoma`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 10331, FIGHT_PROP_ATTACK: 201, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 2.1
  [`Aloy`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 10898, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 676 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Kujou Sara`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 195, FIGHT_PROP_DEFENSE: 627 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 0.5,
      "FIGHT_PROP_CRITICAL_HURT": 0.5,
      "FIGHT_PROP_ATTACK_PERCENT": 0.3,
    },
  },
  
  [`Raiden Shogun`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12907, FIGHT_PROP_ATTACK: 337, FIGHT_PROP_DEFENSE: 789 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Sangonomiya Kokomi`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 13470, FIGHT_PROP_ATTACK: 234, FIGHT_PROP_DEFENSE: 657 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  // Version 2.0
  [`Kamisato Ayaka`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12858, FIGHT_PROP_ATTACK: 342, FIGHT_PROP_DEFENSE: 783 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Sayu`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11853, FIGHT_PROP_ATTACK: 244, FIGHT_PROP_DEFENSE: 744 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },

  [`Traveler (Electro)`]: {
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
  
  [`Yoimiya`]: {
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
  [`Kaedehara Kazuha`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 13348, FIGHT_PROP_ATTACK: 296, FIGHT_PROP_DEFENSE: 806 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  // Version 1.5
  [`Eula`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 13225, FIGHT_PROP_ATTACK: 342, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Yanfei`]: {
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
  [`Rosaria`]: {
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
  [`Hu Tao`]: {
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
  
  [`Xiao`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 12735, FIGHT_PROP_ATTACK: 349, FIGHT_PROP_DEFENSE: 799 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  // Version 1.2
  [`Albedo`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 13225, FIGHT_PROP_ATTACK: 251, FIGHT_PROP_DEFENSE: 876 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  [`Ganyu`]: {
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
  [`Diona`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 9569, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 600 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 1,
    },
  },
  
  [`Tartaglia`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 13103, FIGHT_PROP_ATTACK: 301, FIGHT_PROP_DEFENSE: 814 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Xinyan`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11201, FIGHT_PROP_ATTACK: 248, FIGHT_PROP_DEFENSE: 798 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.24,
    },
  },
  
  [`Zhongli`]: {
    type: "Polearm",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 251, FIGHT_PROP_DEFENSE: 737 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_HP_PERCENT": 0.9,
    },
  },
  
  // Version 1.0
  [`Amber`]: {
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
  
  [`Barbara`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 159, FIGHT_PROP_DEFENSE: 668 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  
  [`Beidou`]: {
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
  
  [`Bennett`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12397, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 771 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_HP_PERCENT": 0.6,
    },
  },
  
  [`Chongyun`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 10983, FIGHT_PROP_ATTACK: 223, FIGHT_PROP_DEFENSE: 648 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Diluc`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12980, FIGHT_PROP_ATTACK: 334, FIGHT_PROP_DEFENSE: 783 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Fischl`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 9189, FIGHT_PROP_ATTACK: 244, FIGHT_PROP_DEFENSE: 593 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.48,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.36,
    },
  },
  
  [`Jean`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 14695, FIGHT_PROP_ATTACK: 239, FIGHT_PROP_DEFENSE: 768 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Kaeya`]: {
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
  
  [`Keqing`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 13103, FIGHT_PROP_ATTACK: 322, FIGHT_PROP_DEFENSE: 799 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.48,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.36,
    },
  },
  
  [`Klee`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 10286, FIGHT_PROP_ATTACK: 310, FIGHT_PROP_DEFENSE: 614 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
      "FIGHT_PROP_ELEMENT_MASTERY": 0.24,
    },
  },
  
  [`Lisa`]: {
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
  
  [`Mona`]: {
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
  
  [`Ningguang`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9787, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 573 },
    weights: {
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Noelle`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 12071, FIGHT_PROP_ATTACK: 191, FIGHT_PROP_DEFENSE: 798 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_DEFENSE_PERCENT": 0.6,
    },
  },
  
  [`Qiqi`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 12368, FIGHT_PROP_ATTACK: 287, FIGHT_PROP_DEFENSE: 922 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 1,
    },
  },
  
  [`Razor`]: {
    type: "Claymore",
    base: { FIGHT_PROP_HP: 11962, FIGHT_PROP_ATTACK: 233, FIGHT_PROP_DEFENSE: 750 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Sucrose`]: {
    type: "Catalyst",
    base: { FIGHT_PROP_HP: 9243, FIGHT_PROP_ATTACK: 169, FIGHT_PROP_DEFENSE: 702 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },

  [`Traveler (Anemo)`]: {
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

  [`Traveler (Geo)`]: {
    type: "Sword",
    base: { FIGHT_PROP_HP: 10875, FIGHT_PROP_ATTACK: 212, FIGHT_PROP_DEFENSE: 683 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_CRITICAL": 1,
      "FIGHT_PROP_CRITICAL_HURT": 1,
      "FIGHT_PROP_ATTACK_PERCENT": 0.6,
    },
  },
  
  [`Venti`]: {
    type: "Bow",
    base: { FIGHT_PROP_HP: 10531, FIGHT_PROP_ATTACK: 263, FIGHT_PROP_DEFENSE: 668 },
    weights: {
      "FIGHT_PROP_CHARGE_EFFICIENCY": 1,
      "FIGHT_PROP_ELEMENT_MASTERY": 1,
    },
  },
  
  [`Xiangling`]: {
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
  
  [`Xingqiu`]: {
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
