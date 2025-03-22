export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 310,
    type: "skill",
    parent: "ult",
    children: ["m3a"],
  },
  "skill": {
    x: 395,
    y: 310,
    type: "skill",
    parent: "ult",
    children: ["m1d"],
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
    y: 410,
    type: "skill",
    parent: "ult",
    children: ["m1a"],
  },

  // Major Nodes
  "A2": {
    x: 190,
    y: 485,
    type: "major",
    parent: "m1a",
    children: ["m2a"],
  },
  "A4": {
    x: 410,
    y: 485,
    type: "major",
    parent: "m1a",
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
    y: 480,
    type: "minor",
    parent: "tech",
    children: ["A2", "A4"],
  },
  "m1b": {
    x: 35,
    y: 305,
    type: "minor",
    parent: "m2a",
  },
  "m1c": {
    x: 500,
    y: 385,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 480,
    y: 225,
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
    x: 100,
    y: 385,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 565,
    y: 305,
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
    x: 120,
    y: 225,
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
