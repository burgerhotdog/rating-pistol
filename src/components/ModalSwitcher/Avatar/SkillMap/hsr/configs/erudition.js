export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 300,
    type: "skill",
    parent: "ult",
    children: ["A2"],
  },
  "skill": {
    x: 395,
    y: 300,
    type: "skill",
    parent: "ult",
    children: ["A4"],
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
    children: ["A6"],
  },
  "tech": {
    x: 300,
    y: 455,
    type: "skill",
    parent: "ult",
    children: ["m1a", "m1e"],
  },

  // Major Nodes
  "A2": {
    x: 130,
    y: 300,
    type: "major",
    parent: "basic",
    children: ["m2a"],
  },
  "A4": {
    x: 470,
    y: 300,
    type: "major",
    parent: "skill",
    children: ["m1c"],
  },
  "A6": {
    x: 300,
    y: 65,
    type: "major",
    parent: "talent",
    children: ["m2c", "m3b"],
  },

  // Minor Nodes
  "m1a": {
    x: 390,
    y: 445,
    type: "minor",
    parent: "tech",
  },
  "m1b": {
    x: 80,
    y: 380,
    type: "minor",
    parent: "m2a",
  },
  "m1c": {
    x: 540,
    y: 300,
    type: "minor",
    parent: "A4",
    children: ["m1d", "m2b"],
  },
  "m1d": {
    x: 520,
    y: 220,
    type: "minor",
    parent: "m1c",
  },
  "m1e": {
    x: 210,
    y: 445,
    type: "minor",
    parent: "tech",
  },

  "m2a": {
    x: 60,
    y: 300,
    type: "minor",
    parent: "A2",
    children: ["m1b", "m3a"],
  },
  "m2b": {
    x: 520,
    y: 380,
    type: "minor",
    parent: "m1c",
  },
  "m2c": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "A6",
  },

  "m3a": {
    x: 80,
    y: 220,
    type: "minor",
    parent: "m2a",
  },
  "m3b": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "A6",
  },
};
