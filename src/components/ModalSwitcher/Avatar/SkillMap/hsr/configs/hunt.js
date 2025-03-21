export default {
  // Skill Nodes
  "basic": {
    x: 200,
    y: 260,
    type: "skill",
    parent: "ult",
    children: ["m3a"],
  },
  "skill": {
    x: 400,
    y: 260,
    type: "skill",
    parent: "ult",
    children: ["m1d"],
  },
  "ult": {
    x: 300,
    y: 310,
    type: "skill",
    children: ["basic", "skill", "talent", "tech"],
  },
  "talent": {
    x: 300,
    y: 210,
    type: "skill",
    parent: "ult",
    children: ["A6"],
  },
  "tech": {
    x: 300,
    y: 395,
    type: "skill",
    parent: "ult",
    children: ["A2", "A4", "m1a"],
  },

  // Major Nodes
  "A2": {
    x: 195,
    y: 405,
    type: "major",
    parent: "tech",
    children: ["m2a"],
  },
  "A4": {
    x: 405,
    y: 405,
    type: "major",
    parent: "tech",
    children: ["m1c"],
  },
  "A6": {
    x: 300,
    y: 135,
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
  },
  "m1b": {
    x: 55,
    y: 270,
    type: "minor",
    parent: "m2a",
  },
  "m1c": {
    x: 475,
    y: 335,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 475,
    y: 180,
    type: "minor",
    parent: "skill",
  },
  "m1e": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m2a": {
    x: 125,
    y: 335,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 545,
    y: 270,
    type: "minor",
    parent: "m1c",
  },
  "m2c": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m3a": {
    x: 125,
    y: 180,
    type: "minor",
    parent: "basic",
  },
  "m3b": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "A6",
    children: ["m1e", "m2c"],
  },
};
