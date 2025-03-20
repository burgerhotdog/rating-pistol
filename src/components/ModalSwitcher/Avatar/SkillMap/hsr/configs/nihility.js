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
    children: ["M1-4"],
  },

  // Major Nodes
  "A2": {
    offsetX: -90 - 70,
    offsetY: 10 - 30,
    type: "major",
    parent: "basic",
    children: ["M2-1"],
  },
  "A4": {
    offsetX: 90 + 70,
    offsetY: 10 - 30,
    type: "major",
    parent: "skill",
    children: ["M1-2"],
  },
  "A6": {
    offsetX: 0,
    offsetY: -60 - 50,
    type: "major",
    parent: "talent",
    children: ["M2-3", "M3-2"],
  },

  // Minor Nodes
  "M2-1": {
    offsetX: -90 - 70 - 50,
    offsetY: 10 - 30 + 40,
    type: "minor",
    parent: "A2",
    children: ["M1-1"],
  },
  "M1-1": {
    offsetX: -90 - 70 - 50 + 30,
    offsetY: 10 - 30 + 40 + 40,
    type: "minor",
    parent: "M2-1",
    children: ["M3-1"],
  },
  "M3-1": {
    offsetX: -90 - 70 - 50 + 30 + 30,
    offsetY: 10 - 30 + 40 + 40 + 40,
    type: "minor",
    parent: "M1-1",
  },
  
  "M1-2": {
    offsetX: 90 + 70 + 50,
    offsetY: 10 - 30 + 40,
    type: "minor",
    parent: "A4",
    children: ["M2-2"],
  },
  "M2-2": {
    offsetX: 90 + 70 + 50 - 30,
    offsetY: 10 - 30 + 40 + 40,
    type: "minor",
    parent: "M1-2",
    children: ["M1-3"],
  },
  "M1-3": {
    offsetX: 90 + 70 + 50 - 30 - 30,
    offsetY: 10 - 30 + 40 + 40 + 40,
    type: "minor",
    parent: "M2-2",
  },

  "M2-3": {
    offsetX: 65,
    offsetY: -60 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  "M3-2": {
    offsetX: -65,
    offsetY: -60 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  
  "M1-4": {
    offsetX: 0,
    offsetY: 60 + 50,
    type: "minor",
    parent: "tech",
    children: ["M1-5"],
  },
  "M1-5": {
    offsetX: 0,
    offsetY: 60 + 50 + 50,
    type: "minor",
    parent: "M1-4",
  },
};
