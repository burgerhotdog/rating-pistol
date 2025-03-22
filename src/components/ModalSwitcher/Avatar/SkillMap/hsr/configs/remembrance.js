export default {
  // Skill Nodes
  "basic": {
    x: 220,
    y: 380,
    type: "skill",
    parent: "ult",
    children: ["tech"],
  },
  "skill": {
    x: 405,
    y: 380,
    type: "skill",
    parent: "ult",
    children: ["talent"],
  },
  "ult": {
    x: 310,
    y: 410,
    type: "skill",
    children: ["basic", "skill", "A4"],
  },
  "talent": {
    x: 455,
    y: 290,
    type: "skill",
    parent: "skill",
    children: ["A2"],
  },
  "tech": {
    x: 170,
    y: 290,
    type: "skill",
    parent: "basic",
    children: ["A6", "m1a"],
  },
  "memoSkill": {
    x: 310,
    y: 270,
    type: "skill",
    children: ["memoTalent"],
  },
  "memoTalent": {
    x: 310,
    y: 155,
    type: "skill",
    parent: "memoSkill",
  },

  // Major Nodes
  "A2": {
    x: 550,
    y: 290,
    type: "major",
    parent: "talent",
    children: ["m1c", "m2b"],
  },
  "A4": {
    x: 310,
    y: 495,
    type: "major",
    parent: "ult",
    children: ["m1d", "m3a"],
  },
  "A6": {
    x: 210,
    y: 190,
    type: "major",
    parent: "tech",
    children: ["m2c"],
  },

  // Minor Nodes
  "m1a": {
    x: 60,
    y: 290,
    type: "minor",
    parent: "tech",
    children: ["m1b", "m2a"],
  },
  "m1b": {
    x: 90,
    y: 380,
    type: "minor",
    parent: "m1a",
  },
  "m1c": {
    x: 540,
    y: 380,
    type: "minor",
    parent: "A2",
  },
  "m1d": {
    x: 400,
    y: 480,
    type: "minor",
    parent: "A4",
  },
  "m1e": {
    x: 360,
    y: 70,
    type: "minor",
    parent: "m3b",
  },

  "m2a": {
    x: 90,
    y: 195,
    type: "minor",
    parent: "m1a",
  },
  "m2b": {
    x: 530,
    y: 195,
    type: "minor",
    parent: "A2",
  },
  "m2c": {
    x: 170,
    y: 105,
    type: "minor",
    parent: "A6",
    children: ["m3b"],
  },

  "m3a": {
    x: 220,
    y: 480,
    type: "minor",
    parent: "A4",
  },
  "m3b": {
    x: 260,
    y: 70,
    type: "minor",
    parent: "m2c",
    children: ["m1e"],
  },
};
