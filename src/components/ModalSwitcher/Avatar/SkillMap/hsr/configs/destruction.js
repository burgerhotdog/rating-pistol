export default {
  // Skill Nodes
  "basic": {
    x: 190,
    y: 285,
    type: "skill",
    parent: "ult",
  },
  "skill": {
    x: 410,
    y: 285,
    type: "skill",
    parent: "ult",
  },
  "ult": {
    x: 300,
    y: 300,
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
    y: 405,
    type: "skill",
    parent: "ult",
    children: ["A2", "A4", "m1a"],
  },

  // Major Nodes
  "A2": {
    x: 185,
    y: 415,
    type: "major",
    parent: "tech",
    children: ["m2a"],
  },
  "A4": {
    x: 415,
    y: 415,
    type: "major",
    parent: "tech",
    children: ["m1c"],
  },
  "A6": {
    x: 300,
    y: 140,
    type: "major",
    parent: "talent",
    children: ["m3b"],
  },

  // Minor Nodes
  "m1a": {
    x: 300,
    y: 490,
    type: "minor",
    parent: "tech",
  },
  "m1b": {
    x: 40,
    y: 300,
    type: "minor",
    parent: "m2a",
    children: ["m3a"],
  },
  "m1c": {
    x: 495,
    y: 365,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 495,
    y: 210,
    type: "minor",
    parent: "m2b",
  },
  "m1e": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m2a": {
    x: 105,
    y: 365,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 560,
    y: 300,
    type: "minor",
    parent: "m1c",
    children: ["m1d"],
  },
  "m2c": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "m3b",
  },

  "m3a": {
    x: 105,
    y: 210,
    type: "minor",
    parent: "m1b",
  },
  "m3b": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "A6",
    children: ["m1e", "m2c"],
  },
};
