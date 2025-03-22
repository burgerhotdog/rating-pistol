export default {
  // Skill Nodes
  "basic": {
    x: 195,
    y: 250,
    type: "skill",
    parent: "ult",
    children: ["M0"],
  },
  "skill": {
    x: 405,
    y: 250,
    type: "skill",
    parent: "ult",
    children: ["M1"],
  },
  "ult": {
    x: 300,
    y: 240,
    type: "skill",
    children: ["basic", "skill", "talent", "tech"],
  },
  "talent": {
    x: 300,
    y: 155,
    type: "skill",
    parent: "ult",
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 340,
    type: "skill",
    parent: "ult",
    children: ["m0"],
  },

  // Major Nodes
  "M0": {
    x: 115,
    y: 215,
    type: "major",
    parent: "basic",
    children: ["m1"],
  },
  "M1": {
    x: 485,
    y: 215,
    type: "major",
    parent: "skill",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 70,
    type: "major",
    parent: "talent",
    children: ["m8", "m7"],
  },

  // Minor Nodes
  "m0": {
    x: 300,
    y: 415,
    type: "minor",
    parent: "tech",
    children: ["m9"],
  },
  "m2": {
    x: 100,
    y: 380,
    type: "minor",
    parent: "m1",
    children: ["m3"],
  },
  "m4": {
    x: 570,
    y: 300,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 430,
    y: 460,
    type: "minor",
    parent: "m5",
  },
  "m9": {
    x: 300,
    y: 490,
    type: "minor",
    parent: "m0",
  },

  "m1": {
    x: 30,
    y: 300,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 500,
    y: 380,
    type: "minor",
    parent: "m4",
    children: ["m6"],
  },
  "m8": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "M2",
  },

  "m3": {
    x: 170,
    y: 460,
    type: "minor",
    parent: "m2",
  },
  "m7": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "M2",
  },
};
