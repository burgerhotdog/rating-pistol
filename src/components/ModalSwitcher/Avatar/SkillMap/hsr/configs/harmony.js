export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 270,
    type: "skill",
    parent: "talent",
    children: ["M0"],
  },
  "skill": {
    x: 395,
    y: 270,
    type: "skill",
    parent: "talent",
    children: ["M1"],
  },
  "ult": {
    x: 300,
    y: 340,
    type: "skill",
    parent: "talent",
    children: ["tech"],
  },
  "talent": {
    x: 300,
    y: 255,
    type: "skill",
    children: ["basic", "skill", "ultimate", "M2"],
  },
  "tech": {
    x: 300,
    y: 430,
    type: "skill",
    parent: "ult",
    children: ["m0"],
  },

  // Major Nodes
  "M0": {
    x: 85,
    y: 320,
    type: "major",
    parent: "basic",
    children: ["m1"],
  },
  "M1": {
    x: 515,
    y: 320,
    type: "major",
    parent: "skill",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 150,
    type: "major",
    parent: "talent",
    children: ["m7"],
  },

  // Minor Nodes
  "m0": {
    x: 300,
    y: 500,
    type: "minor",
    parent: "tech",
    children: ["m6", "m3"],
  },
  "m2": {
    x: 115,
    y: 200,
    type: "minor",
    parent: "m1",
  },
  "m4": {
    x: 475,
    y: 395,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 405,
    y: 480,
    type: "minor",
    parent: "m0",
  },
  "m9": {
    x: 410,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m1": {
    x: 35,
    y: 250,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 395,
    y: 365,
    type: "minor",
    parent: "m4",
  },
  "m8": {
    x: 190,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m3": {
    x: 195,
    y: 480,
    type: "minor",
    parent: "m0",
  },
  "m7": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "M2",
    children: ["m9", "m8"],
  },
};
