export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 285,
    type: "skill",
    parent: "ult",
  },
  "skill": {
    x: 395,
    y: 285,
    type: "skill",
    parent: "ult",
  },
  "ult": {
    x: 300,
    y: 305,
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
    y: 400,
    type: "skill",
    parent: "ult",
    children: ["A2", "A4", "i1"],
  },

  // Major Nodes
  "A2": {
    x: 440,
    y: 430,
    type: "major",
    parent: "tech",
    children: ["m2a"],
  },
  "A4": {
    x: 160,
    y: 430,
    type: "major",
    parent: "tech",
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
    x: 350,
    y: 485,
    type: "minor",
    parent: "i1",
  },
  "m1b": {
    x: 540,
    y: 290,
    type: "minor",
    parent: "m2a",
    children: ["m3a"],
  },
  "m1c": {
    x: 95,
    y: 350,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m1d": {
    x: 130,
    y: 220,
    type: "minor",
    parent: "m2b",
  },
  "m1e": {
    x: 250,
    y: 485,
    type: "minor",
    parent: "i1",
  },

  "m2a": {
    x: 505,
    y: 350,
    type: "minor",
    parent: "A2",
    children: ["m1b"],
  },
  "m2b": {
    x: 60,
    y: 290,
    type: "minor",
    parent: "m1c",
    children: ["m1d"],
  },
  "m2c": {
    x: 190,
    y: 95,
    type: "minor",
    parent: "A6",
  },

  "m3a": {
    x: 470,
    y: 220,
    type: "minor",
    parent: "m1b",
  },
  "m3b": {
    x: 410,
    y: 95,
    type: "minor",
    parent: "A6",
  },

  // Invis Nodes
  "i1": {
    x: 300,
    y: 475,
    type: "invis",
    parent: "tech",
    children: ["m1a", "m1e"],
  },
};
