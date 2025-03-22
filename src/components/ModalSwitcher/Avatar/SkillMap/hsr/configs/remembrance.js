export default {
  // Skill Nodes
  "basic": {
    x: 220,
    y: 380,
    type: "skill",
    parent: "ult",
    children: ["tech"],
  },
  "skill": {
    x: 405,
    y: 380,
    type: "skill",
    parent: "ult",
    children: ["talent"],
  },
  "ult": {
    x: 310,
    y: 410,
    type: "skill",
    children: ["basic", "skill", "M1"],
  },
  "talent": {
    x: 455,
    y: 290,
    type: "skill",
    parent: "skill",
    children: ["M0"],
  },
  "tech": {
    x: 170,
    y: 290,
    type: "skill",
    parent: "basic",
    children: ["M2", "m0"],
  },
  "memoSkill": {
    x: 310,
    y: 270,
    type: "skill",
    children: ["memoTalent"],
  },
  "memoTalent": {
    x: 310,
    y: 155,
    type: "skill",
    parent: "memoSkill",
  },

  // Major Nodes
  "M0": {
    x: 550,
    y: 290,
    type: "major",
    parent: "talent",
    children: ["m4", "m5"],
  },
  "M1": {
    x: 310,
    y: 495,
    type: "major",
    parent: "ult",
    children: ["m6", "m3"],
  },
  "M2": {
    x: 210,
    y: 190,
    type: "major",
    parent: "tech",
    children: ["m8"],
  },

  // Minor Nodes
  "m0": {
    x: 60,
    y: 290,
    type: "minor",
    parent: "tech",
    children: ["m2", "m1"],
  },
  "m2": {
    x: 90,
    y: 380,
    type: "minor",
    parent: "m0",
  },
  "m4": {
    x: 540,
    y: 380,
    type: "minor",
    parent: "M0",
  },
  "m6": {
    x: 400,
    y: 480,
    type: "minor",
    parent: "M1",
  },
  "m9": {
    x: 360,
    y: 70,
    type: "minor",
    parent: "m7",
  },

  "m1": {
    x: 90,
    y: 195,
    type: "minor",
    parent: "m0",
  },
  "m5": {
    x: 530,
    y: 195,
    type: "minor",
    parent: "M0",
  },
  "m8": {
    x: 170,
    y: 105,
    type: "minor",
    parent: "M2",
    children: ["m7"],
  },

  "m3": {
    x: 220,
    y: 480,
    type: "minor",
    parent: "M1",
  },
  "m7": {
    x: 260,
    y: 70,
    type: "minor",
    parent: "m8",
    children: ["m9"],
  },
};
