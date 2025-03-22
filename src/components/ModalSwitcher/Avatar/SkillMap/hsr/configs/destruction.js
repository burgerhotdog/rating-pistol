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
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 405,
    type: "skill",
    parent: "ult",
    children: ["M0", "M1", "m0"],
  },

  // Major Nodes
  "M0": {
    x: 185,
    y: 415,
    type: "major",
    parent: "tech",
    children: ["m1"],
  },
  "M1": {
    x: 415,
    y: 415,
    type: "major",
    parent: "tech",
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
    y: 490,
    type: "minor",
    parent: "tech",
  },
  "m2": {
    x: 40,
    y: 300,
    type: "minor",
    parent: "m1",
    children: ["m3"],
  },
  "m4": {
    x: 495,
    y: 365,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 495,
    y: 210,
    type: "minor",
    parent: "m5",
  },
  "m9": {
    x: 415,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m1": {
    x: 105,
    y: 365,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 560,
    y: 300,
    type: "minor",
    parent: "m4",
    children: ["m6"],
  },
  "m8": {
    x: 185,
    y: 90,
    type: "minor",
    parent: "m7",
  },

  "m3": {
    x: 105,
    y: 210,
    type: "minor",
    parent: "m2",
  },
  "m7": {
    x: 300,
    y: 70,
    type: "minor",
    parent: "M2",
    children: ["m9", "m8"],
  },
};
