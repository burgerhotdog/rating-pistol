export default {
  // Skill Nodes
  "basic": {
    x: 195,
    y: 250,
    type: "skill",
    parent: "ult",
    children: ["A2"],
  },
  "skill": {
    x: 405,
    y: 250,
    type: "skill",
    parent: "ult",
    children: ["A4"],
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
    children: ["A6"],
  },
  "tech": {
    x: 300,
    y: 340,
    type: "skill",
    parent: "ult",
    children: ["m1a"],
  },

  // Major Nodes
  "A2": {
    x: 115,
    y: 215,
    type: "major",
    parent: "basic",
    children: ["m2a"],
  },
  "A4": {
    x: 485,
    y: 215,
    type: "major",
    parent: "skill",
    children: ["m1c"],
  },
  "A6": {
    x: 300,
    y: 70,
    type: "major",
    parent: "talent",
    children: ["m2c", "m3b"],
  },

  // Minor Nodes
  "m1a": {
    x: 300,
    y: 415,
    type: "minor",
    parent: "tech",
    children: ["m1e"],
  },
  "m1b": {
    x: 100,
    y: 380,
    type: "minor",
    parent: "m2a",
    children: ["m3a"],
  },
  "m1c": {
    x: 570,
    y: 300,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 430,
    y: 460,
    type: "minor",
    parent: "m2b",
  },
  "m1e": {
    x: 300,
    y: 490,
    type: "minor",
    parent: "m1a",
  },

  "m2a": {
    x: 30,
    y: 300,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 500,
    y: 380,
    type: "minor",
    parent: "m1c",
    children: ["m1d"],
  },
  "m2c": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "A6",
  },

  "m3a": {
    x: 170,
    y: 460,
    type: "minor",
    parent: "m1b",
  },
  "m3b": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "A6",
  },
};
