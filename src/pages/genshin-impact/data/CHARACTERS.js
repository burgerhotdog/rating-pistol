const CHARACTERS = {
  // Verison 5.4
  /*
  [`Mizuki`]: {
    type: "Catalyst",
    base: { HP: 10000, ATK: 100, DEF: 100 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },
  */

  // Version 5.3
  [`Citlali`]: {
    type: "Catalyst",
    base: { HP: 11633, ATK: 126, DEF: 763 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },

  [`Lan Yan`]: {
    type: "Catalyst",
    base: { HP: 9243, ATK: 250, DEF: 580 },
    includeEr: true,
    weights: {
      "ATK%": 1,
      "Elemental Mastery": 0.6,
    },
  },
  
  [`Mavuika`]: {
    type: "Claymore",
    base: { HP: 12552, ATK: 358, DEF: 791 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },

  [`Traveler (Pyro)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 5.2
  [`Chasca`]: {
    type: "Bow",
    base: { HP: 9796, ATK: 346, DEF: 614 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Ororon`]: {
    type: "Bow",
    base: { HP: 9243, ATK: 244, DEF: 586 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 5.1
  [`Xilonen`]: {
    type: "Sword",
    base: { HP: 12405, ATK: 275, DEF: 929 },
    includeEr: true,
    weights: {
      "DEF%": 0.6,
    },
  },
  
  // Version 5.0
  [`Kachina`]: {
    type: "Polearm",
    base: { HP: 11799, ATK: 216, DEF: 792 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
    },
  },
  
  [`Kinich`]: {
    type: "Claymore",
    base: { HP: 12858, ATK: 332, DEF: 801 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Mualani`]: {
    type: "Catalyst",
    base: { HP: 15184, ATK: 181, DEF: 570 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 4.8
  [`Emilie`]: {
    type: "Polearm",
    base: { HP: 13568, ATK: 334, DEF: 730 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 4.7
  [`Clorinde`]: {
    type: "Sword",
    base: { HP: 12956, ATK: 337, DEF: 783 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Sethos`]: {
    type: "Bow",
    base: { HP: 9787, ATK: 227, DEF: 559 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.48,
      "ATK%": 0.36,
    },
  },
  
  [`Sigewinne`]: {
    type: "Bow",
    base: { HP: 13348, ATK: 192, DEF: 499 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 4.6
  [`Arlecchino`]: {
    type: "Polearm",
    base: { HP: 13103, ATK: 342, DEF: 764 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 4.5
  [`Chiori`]: {
    type: "Sword",
    base: { HP: 11437, ATK: 322, DEF: 953 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
      "ATK%": 0.12,
    },
  },
  
  // Version 4.4
  [`Gaming`]: {
    type: "Claymore",
    base: { HP: 11418, ATK: 301, DEF: 702 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Xianyun`]: {
    type: "Catalyst",
    base: { HP: 10409, ATK: 334, DEF: 572 },
    includeEr: true,
    weights: {
      "ATK%": 1,
    },
  },
  
  // Version 4.3
  [`Chevreuse`]: {
    type: "Polearm",
    base: { HP: 11962, ATK: 193, DEF: 604 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Navia`]: {
    type: "Claymore",
    base: { HP: 12650, ATK: 351, DEF: 793 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 4.2
  [`Charlotte`]: {
    type: "Catalyst",
    base: { HP: 10766, ATK: 173, DEF: 546 },
    includeEr: true,
    weights: {
      "ATK%": 0.6,
    },
  },
  
  [`Furina`]: {
    type: "Sword",
    base: { HP: 15307, ATK: 243, DEF: 695 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 4.1
  [`Neuvillette`]: {
    type: "Catalyst",
    base: { HP: 14695, ATK: 208, DEF: 576 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Wriothesley`]: {
    type: "Catalyst",
    base: { HP: 13592, ATK: 310, DEF: 763 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 4.0
  [`Freminet`]: {
    type: "Claymore",
    base: { HP: 12071, ATK: 254, DEF: 708 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Lynette`]: {
    type: "Sword",
    base: { HP: 12397, ATK: 231, DEF: 711 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Lyney`]: {
    type: "Bow",
    base: { HP: 11021, ATK: 231, DEF: 537 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  [`Traveler (Hydro)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 3.8
  
  // Version 3.7
  [`Kirara`]: {
    type: "Sword",
    base: { HP: 12179, ATK: 223, DEF: 546 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 3.6
  [`Baizhu`]: {
    type: "Catalyst",
    base: { HP: 13348, ATK: 192, DEF: 499 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Kaveh`]: {
    type: "Claymore",
    base: { HP: 11962, ATK: 233, DEF: 750 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  // Version 3.5
  [`Dehya`]: {
    type: "Claymore",
    base: { HP: 15674, ATK: 265, DEF: 627 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.48,
      "ATK%": 0.36,
    },
  },
  
  [`Mika`]: {
    type: "Polearm",
    base: { HP: 12506, ATK: 223, DEF: 713 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 3.4
  [`Alhaitham`]: {
    type: "Sword",
    base: { HP: 13348, ATK: 313, DEF: 781 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.6,
      "ATK%": 0.24,
    },
  },
  
  [`Yaoyao`]: {
    type: "Polearm",
    base: { HP: 12288, ATK: 212, DEF: 750 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 3.3
  [`Faruzan`]: {
    type: "Bow",
    base: { HP: 9569, ATK: 196, DEF: 627 },
    includeEr: true,
    weights: {
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "ATK%": 0.3,
      "Elemental Mastery": 0.12,
    },
  },
  
  [`Wanderer`]: {
    type: "Catalyst",
    base: { HP: 10164, ATK: 327, DEF: 607 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 3.2
  [`Layla`]: {
    type: "Sword",
    base: { HP: 11092, ATK: 216, DEF: 655 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Nahida`]: {
    type: "Catalyst",
    base: { HP: 10360, ATK: 298, DEF: 630 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.6,
      "ATK%": 0.24,
    },
  },
  
  // Version 3.1
  [`Candace`]: {
    type: "Polearm",
    base: { HP: 10874, ATK: 212, DEF: 682 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Cyno`]: {
    type: "Polearm",
    base: { HP: 12490, ATK: 318, DEF: 859 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.48,
      "ATK%": 0.36,
    },
  },
  
  [`Nilou`]: {
    type: "Sword",
    base: { HP: 15184, ATK: 229, DEF: 728 },
    includeEr: false,
    weights: {
      "HP%": 1,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 3.0
  [`Collei`]: {
    type: "Bow",
    base: { HP: 9787, ATK: 199, DEF: 600 },
    includeEr: true,
    weights: {
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "Elemental Mastery": 0.24,
      "ATK%": 0.18,
    },
  },
  
  [`Dori`]: {
    type: "Claymore",
    base: { HP: 12397, ATK: 223, DEF: 723 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Tighnari`]: {
    type: "Bow",
    base: { HP: 10849, ATK: 267, DEF: 630 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.48,
      "ATK%": 0.36,
    },
  },

  [`Traveler (Dendro)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "Elemental Mastery": 0.24,
      "ATK%": 0.18,
    },
  },
  
  // Version 2.8
  [`Shikanoin Heizou`]: {
    type: "Catalyst",
    base: { HP: 10657, ATK: 225, DEF: 683 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 2.7
  [`Kuki Shinobu`]: {
    type: "Sword",
    base: { HP: 12288, ATK: 212, DEF: 750 },
    includeEr: false,
    weights: {
      "Elemental Mastery": 1,
      "HP%": 0.6,
    },
  },
  
  [`Yelan`]: {
    type: "Bow",
    base: { HP: 14450, ATK: 243, DEF: 547 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 2.6
  [`Kamisato Ayato`]: {
    type: "Sword",
    base: { HP: 13715, ATK: 298, DEF: 768 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 2.5
  [`Yae Miko`]: {
    type: "Catalyst",
    base: { HP: 10372, ATK: 339, DEF: 568 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.48,
      "ATK%": 0.36,
    },
  },
  
  // Version 2.4
  [`Shenhe`]: {
    type: "Polearm",
    base: { HP: 12992, ATK: 303, DEF: 830 },
    includeEr: true,
    weights: {
      "ATK%": 1,
    },
  },
  
  [`Yun Jin`]: {
    type: "Polearm",
    base: { HP: 10657, ATK: 191, DEF: 734 },
    includeEr: true,
    weights: {
      "DEF%": 1,
    },
  },
  
  // Version 2.3
  [`Arataki Itto`]: {
    type: "Claymore",
    base: { HP: 12858, ATK: 227, DEF: 959 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
      "ATK%": 0.12,
    },
  },
  
  [`Gorou`]: {
    type: "Bow",
    base: { HP: 9569, ATK: 182, DEF: 648 },
    includeEr: true,
    weights: {
      "DEF%": 0.6,
    },
  },
  
  // Version 2.2
  [`Thoma`]: {
    type: "Polearm",
    base: { HP: 10331, ATK: 201, DEF: 750 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 2.1
  [`Aloy`]: {
    type: "Bow",
    base: { HP: 10898, ATK: 233, DEF: 676 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Kujou Sara`]: {
    type: "Bow",
    base: { HP: 9569, ATK: 195, DEF: 627 },
    includeEr: true,
    weights: {
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "ATK%": 0.3,
    },
  },
  
  [`Raiden Shogun`]: {
    type: "Polearm",
    base: { HP: 12907, ATK: 337, DEF: 789 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Sangonomiya Kokomi`]: {
    type: "Catalyst",
    base: { HP: 13470, ATK: 234, DEF: 657 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 2.0
  [`Kamisato Ayaka`]: {
    type: "Sword",
    base: { HP: 12858, ATK: 342, DEF: 783 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Sayu`]: {
    type: "Claymore",
    base: { HP: 11853, ATK: 244, DEF: 744 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
      "ATK%": 0.6,
    },
  },

  [`Traveler (Electro)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Yoimiya`]: {
    type: "Bow",
    base: { HP: 10164, ATK: 322, DEF: 614 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 1.6
  [`Kaedehara Kazuha`]: {
    type: "Sword",
    base: { HP: 13348, ATK: 296, DEF: 806 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  // Version 1.5
  [`Eula`]: {
    type: "Claymore",
    base: { HP: 13225, ATK: 342, DEF: 750 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Yanfei`]: {
    type: "Catalyst",
    base: { HP: 9352, ATK: 240, DEF: 586 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 1.4
  [`Rosaria`]: {
    type: "Polearm",
    base: { HP: 12288, ATK: 240, DEF: 709 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 1.3
  [`Hu Tao`]: {
    type: "Polearm",
    base: { HP: 15522, ATK: 106, DEF: 876 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
      "Elemental Mastery": 0.24,
      "ATK%": 0.12,
    },
  },
  
  [`Xiao`]: {
    type: "Polearm",
    base: { HP: 12735, ATK: 349, DEF: 799 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.2
  [`Albedo`]: {
    type: "Sword",
    base: { HP: 13225, ATK: 251, DEF: 876 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
    },
  },
  
  [`Ganyu`]: {
    type: "Bow",
    base: { HP: 9796, ATK: 334, DEF: 630 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  // Version 1.1
  [`Diona`]: {
    type: "Bow",
    base: { HP: 9569, ATK: 212, DEF: 600 },
    includeEr: true,
    weights: {
      "HP%": 1,
    },
  },
  
  [`Tartaglia`]: {
    type: "Bow",
    base: { HP: 13103, ATK: 301, DEF: 814 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Xinyan`]: {
    type: "Claymore",
    base: { HP: 11201, ATK: 248, DEF: 798 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "DEF%": 0.24,
    },
  },
  
  [`Zhongli`]: {
    type: "Polearm",
    base: { HP: 14695, ATK: 251, DEF: 737 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.9,
    },
  },
  
  // Version 1.0
  [`Amber`]: {
    type: "Bow",
    base: { HP: 9461, ATK: 223, DEF: 600 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Barbara`]: {
    type: "Catalyst",
    base: { HP: 9787, ATK: 159, DEF: 668 },
    includeEr: true,
    weights: {
      "HP%": 0.6,
    },
  },
  
  [`Beidou`]: {
    type: "Claymore",
    base: { HP: 13049, ATK: 225, DEF: 648 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Bennett`]: {
    type: "Sword",
    base: { HP: 12397, ATK: 191, DEF: 771 },
    includeEr: true,
    weights: {
      "HP%": 0.6,
    },
  },
  
  [`Chongyun`]: {
    type: "Claymore",
    base: { HP: 10983, ATK: 223, DEF: 648 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Diluc`]: {
    type: "Claymore",
    base: { HP: 12980, ATK: 334, DEF: 783 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Fischl`]: {
    type: "Bow",
    base: { HP: 9189, ATK: 244, DEF: 593 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.48,
      "Elemental Mastery": 0.36,
    },
  },
  
  [`Jean`]: {
    type: "Sword",
    base: { HP: 14695, ATK: 239, DEF: 768 },
    includeEr: true,
    weights: {
      "ATK%": 0.6,
    },
  },
  
  [`Kaeya`]: {
    type: "Sword",
    base: { HP: 11636, ATK: 223, DEF: 791 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Keqing`]: {
    type: "Sword",
    base: { HP: 13103, ATK: 322, DEF: 799 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.48,
      "Elemental Mastery": 0.36,
    },
  },
  
  [`Klee`]: {
    type: "Catalyst",
    base: { HP: 10286, ATK: 310, DEF: 614 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Lisa`]: {
    type: "Catalyst",
    base: { HP: 9569, ATK: 231, DEF: 573 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.48,
      "Elemental Mastery": 0.36,
    },
  },
  
  [`Mona`]: {
    type: "Catalyst",
    base: { HP: 10409, ATK: 287, DEF: 653 },
    includeEr: true,
    weights: {
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "ATK%": 0.3,
      "Elemental Mastery": 0.12,
    },
  },
  
  [`Ningguang`]: {
    type: "Catalyst",
    base: { HP: 9787, ATK: 212, DEF: 573 },
    includeEr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Noelle`]: {
    type: "Claymore",
    base: { HP: 12071, ATK: 191, DEF: 798 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
    },
  },
  
  [`Qiqi`]: {
    type: "Sword",
    base: { HP: 12368, ATK: 287, DEF: 922 },
    includeEr: true,
    weights: {
      "ATK%": 1,
    },
  },
  
  [`Razor`]: {
    type: "Claymore",
    base: { HP: 11962, ATK: 233, DEF: 750 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Sucrose`]: {
    type: "Catalyst",
    base: { HP: 9243, ATK: 169, DEF: 702 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },

  [`Traveler (Anemo)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },

  [`Traveler (Geo)`]: {
    type: "Sword",
    base: { HP: 10875, ATK: 212, DEF: 683 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  [`Venti`]: {
    type: "Bow",
    base: { HP: 10531, ATK: 263, DEF: 668 },
    includeEr: true,
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  [`Xiangling`]: {
    type: "Polearm",
    base: { HP: 10874, ATK: 225, DEF: 668 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
  
  [`Xingqiu`]: {
    type: "Sword",
    base: { HP: 10222, ATK: 201, DEF: 757 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Elemental Mastery": 0.24,
    },
  },
};

export default CHARACTERS;
