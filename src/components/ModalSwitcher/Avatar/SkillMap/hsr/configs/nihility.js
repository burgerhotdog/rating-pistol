export default {
  // Skill Nodes
  "basic": {
    offsetX: -80,
    offsetY: 10,
    type: "skill",
    parent: "ult",
    children: ["A2"],
  },
  "skill": {
    offsetX: 80,
    offsetY: 10,
    type: "skill",
    parent: "ult",
    children: ["A4"],
  },
  "ult": {
    offsetX: 0,
    offsetY: 0,
    type: "skill",
    children: ["basic", "skill", "talent", "tech"],
  },
  "talent": {
    offsetX: 0,
    offsetY: -60,
    type: "skill",
    parent: "ult",
    children: ["A6"],
  },
  "tech": {
    offsetX: 0,
    offsetY: 60,
    type: "skill",
    parent: "ult",
    children: ["m1d"],
  },

  // Major Nodes
  "A2": {
    offsetX: -90 - 70,
    offsetY: 10 - 30,
    type: "major",
    parent: "basic",
    children: ["m2a"],
  },
  "A4": {
    offsetX: 90 + 70,
    offsetY: 10 - 30,
    type: "major",
    parent: "skill",
    children: ["m1b"],
  },
  "A6": {
    offsetX: 0,
    offsetY: -60 - 50,
    type: "major",
    parent: "talent",
    children: ["m2c", "m3b"],
  },

  // Minor Nodes
  "m2a": {
    offsetX: -90 - 70 - 50,
    offsetY: 10 - 30 + 40,
    type: "minor",
    parent: "A2",
    children: ["m1a"],
  },
  "m1a": {
    offsetX: -90 - 70 - 50 + 30,
    offsetY: 10 - 30 + 40 + 40,
    type: "minor",
    parent: "m2a",
    children: ["m3a"],
  },
  "m3a": {
    offsetX: -90 - 70 - 50 + 30 + 30,
    offsetY: 10 - 30 + 40 + 40 + 40,
    type: "minor",
    parent: "m1a",
  },
  
  "m1b": {
    offsetX: 90 + 70 + 50,
    offsetY: 10 - 30 + 40,
    type: "minor",
    parent: "A4",
    children: ["m2b"],
  },
  "m2b": {
    offsetX: 90 + 70 + 50 - 30,
    offsetY: 10 - 30 + 40 + 40,
    type: "minor",
    parent: "m1b",
    children: ["m1c"],
  },
  "m1c": {
    offsetX: 90 + 70 + 50 - 30 - 30,
    offsetY: 10 - 30 + 40 + 40 + 40,
    type: "minor",
    parent: "m2b",
  },

  "m2c": {
    offsetX: 65,
    offsetY: -60 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  "m3b": {
    offsetX: -65,
    offsetY: -60 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  
  "m1d": {
    offsetX: 0,
    offsetY: 60 + 50,
    type: "minor",
    parent: "tech",
    children: ["m1e"],
  },
  "m1e": {
    offsetX: 0,
    offsetY: 60 + 50 + 50,
    type: "minor",
    parent: "m1d",
  },
};
