export default {
  // Skill Nodes
  "basic": {
    x: 200,
    y: 260,
    type: "skill",
    parent: "ult",
    children: ["m3"],
  },
  "skill": {
    x: 400,
    y: 260,
    type: "skill",
    parent: "ult",
    children: ["m6"],
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
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 395,
    type: "skill",
    parent: "ult",
    children: ["M0", "M1", "m0"],
  },

  // Major Nodes
  "M0": {
    x: 195,
    y: 405,
    type: "major",
    parent: "tech",
    children: ["m1"],
  },
  "M1": {
    x: 405,
    y: 405,
    type: "major",
    parent: "tech",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 135,
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
  },
  "m2": {
    x: 55,
    y: 270,
    type: "minor",
    parent: "m1",
  },
  "m4": {
    x: 475,
    y: 335,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 475,
    y: 180,
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
    x: 125,
    y: 335,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 545,
    y: 270,
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
    x: 125,
    y: 180,
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
