export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 300,
    type: "skill",
    parent: "ult",
    children: ["M0"],
  },
  "skill": {
    x: 395,
    y: 300,
    type: "skill",
    parent: "ult",
    children: ["M1"],
  },
  "ult": {
    x: 300,
    y: 300,
    type: "skill",
    children: ["basic", "skill", "talent", "tech"],
  },
  "talent": {
    x: 300,
    y: 190,
    type: "skill",
    parent: "ult",
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 455,
    type: "skill",
    parent: "ult",
    children: ["m0", "m9"],
  },

  // Major Nodes
  "M0": {
    x: 130,
    y: 300,
    type: "major",
    parent: "basic",
    children: ["m1"],
  },
  "M1": {
    x: 470,
    y: 300,
    type: "major",
    parent: "skill",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 65,
    type: "major",
    parent: "talent",
    children: ["m8", "m7"],
  },

  // Minor Nodes
  "m0": {
    x: 210,
    y: 445,
    type: "minor",
    parent: "tech",
  },
  "m2": {
    x: 80,
    y: 380,
    type: "minor",
    parent: "m1",
  },
  "m4": {
    x: 540,
    y: 300,
    type: "minor",
    parent: "M1",
    children: ["m6", "m5"],
  },
  "m6": {
    x: 520,
    y: 220,
    type: "minor",
    parent: "m4",
  },
  "m9": {
    x: 390,
    y: 445,
    type: "minor",
    parent: "tech",
  },

  "m1": {
    x: 60,
    y: 300,
    type: "minor",
    parent: "M0",
    children: ["m2", "m3"],
  },
  "m5": {
    x: 520,
    y: 380,
    type: "minor",
    parent: "m4",
  },
  "m8": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "M2",
  },

  "m3": {
    x: 80,
    y: 220,
    type: "minor",
    parent: "m1",
  },
  "m7": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "M2",
  },
};
