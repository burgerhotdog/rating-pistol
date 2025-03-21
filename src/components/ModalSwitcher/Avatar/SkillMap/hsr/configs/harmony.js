export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 270,
    type: "skill",
    parent: "talent",
    children: ["A2"],
  },
  "skill": {
    x: 395,
    y: 270,
    type: "skill",
    parent: "talent",
    children: ["A4"],
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
    children: ["basic", "skill", "ultimate", "A6"],
  },
  "tech": {
    x: 300,
    y: 430,
    type: "skill",
    parent: "ult",
    children: ["m1a"],
  },

  // Major Nodes
  "A2": {
    x: 85,
    y: 320,
    type: "major",
    parent: "basic",
    children: ["m2a"],
  },
  "A4": {
    x: 515,
    y: 320,
    type: "major",
    parent: "skill",
    children: ["m1c"],
  },
  "A6": {
    x: 300,
    y: 150,
    type: "major",
    parent: "talent",
    children: ["m3b"],
  },

  // Minor Nodes
  "m1a": {
    x: 300,
    y: 500,
    type: "minor",
    parent: "tech",
    children: ["m1d", "m3a"],
  },
  "m1b": {
    x: 115,
    y: 200,
    type: "minor",
    parent: "m2a",
  },
  "m1c": {
    x: 475,
    y: 395,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 405,
    y: 480,
    type: "minor",
    parent: "m1a",
  },
  "m1e": {
    x: 410,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m2a": {
    x: 35,
    y: 250,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 395,
    y: 365,
    type: "minor",
    parent: "m1c",
  },
  "m2c": {
    x: 190,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m3a": {
    x: 195,
    y: 480,
    type: "minor",
    parent: "m1a",
  },
  "m3b": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "A6",
    children: ["m1e", "m2c"],
  },
};
