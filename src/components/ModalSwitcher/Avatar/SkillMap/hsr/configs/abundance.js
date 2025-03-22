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
    children: ["M2"],
  },
  "tech": {
    x: 300,
    y: 400,
    type: "skill",
    parent: "ult",
    children: ["M0", "M1", "i1"],
  },

  // Major Nodes
  "M0": {
    x: 440,
    y: 430,
    type: "major",
    parent: "tech",
    children: ["m1"],
  },
  "M1": {
    x: 160,
    y: 430,
    type: "major",
    parent: "tech",
    children: ["m4"],
  },
  "M2": {
    x: 300,
    y: 70,
    type: "major",
    parent: "talent",
    children: ["m8", "m7"],
  },

  // Minor Nodes
  "m0": {
    x: 350,
    y: 485,
    type: "minor",
    parent: "i1",
  },
  "m2": {
    x: 540,
    y: 290,
    type: "minor",
    parent: "m1",
    children: ["m3"],
  },
  "m4": {
    x: 95,
    y: 350,
    type: "minor",
    parent: "M1",
    children: ["m5"],
  },
  "m6": {
    x: 130,
    y: 220,
    type: "minor",
    parent: "m5",
  },
  "m9": {
    x: 250,
    y: 485,
    type: "minor",
    parent: "i1",
  },

  "m1": {
    x: 505,
    y: 350,
    type: "minor",
    parent: "M0",
    children: ["m2"],
  },
  "m5": {
    x: 60,
    y: 290,
    type: "minor",
    parent: "m4",
    children: ["m6"],
  },
  "m8": {
    x: 190,
    y: 95,
    type: "minor",
    parent: "M2",
  },

  "m3": {
    x: 470,
    y: 220,
    type: "minor",
    parent: "m2",
  },
  "m7": {
    x: 410,
    y: 95,
    type: "minor",
    parent: "M2",
  },

  // Invis Nodes
  "i1": {
    x: 300,
    y: 475,
    type: "invis",
    parent: "tech",
    children: ["m0", "m9"],
  },
};
