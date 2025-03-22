export default {
  // Skill Nodes
  "basic": {
    x: 205,
    y: 310,
    type: "skill",
    parent: "ult",
    children: ["m3"],
  },
  "skill": {
    x: 395,
    y: 310,
    type: "skill",
    parent: "ult",
    children: ["m6"],
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
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 410,
    type: "skill",
    parent: "ult",
    children: ["m0"],
  },

  // Major Nodes
  "M0": {
    x: 190,
    y: 485,
    type: "major",
    parent: "m0",
    children: ["m1"],
  },
  "M1": {
    x: 410,
    y: 485,
    type: "major",
    parent: "m0",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 140,
    type: "major",
    parent: "talent",
    children: ["m7"],
  },

  // Minor Nodes
  "m0": {
    x: 300,
    y: 480,
    type: "minor",
    parent: "tech",
    children: ["M0", "M1"],
  },
  "m2": {
    x: 35,
    y: 305,
    type: "minor",
    parent: "m1",
  },
  "m4": {
    x: 500,
    y: 385,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 480,
    y: 225,
    type: "minor",
    parent: "skill",
  },
  "m9": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m1": {
    x: 100,
    y: 385,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 565,
    y: 305,
    type: "minor",
    parent: "m4",
  },
  "m8": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m3": {
    x: 120,
    y: 225,
    type: "minor",
    parent: "basic",
  },
  "m7": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "M2",
    children: ["m9", "m8"],
  },
};
