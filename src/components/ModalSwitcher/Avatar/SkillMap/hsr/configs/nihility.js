export default {
  // Skill Nodes
  "basic": {
    xOffset: -60,
    yOffset: 5,
    type: "skill",
    parent: "ult",
    children: ["A2"],
  },
  "skill": {
    xOffset: 60,
    yOffset: 5,
    type: "skill",
    parent: "ult",
    children: ["A4"],
  },
  "ult": {
    xOffset: 0,
    yOffset: 0,
    type: "skill",
    children: ["basic", "skill", "talent", "tech"],
  },
  "talent": {
    xOffset: 0,
    yOffset: -50,
    type: "skill",
    parent: "ult",
    children: ["A6"],
  },
  "tech": {
    xOffset: 0,
    yOffset: 50,
    type: "skill",
    parent: "ult",
    children: ["2-4"],
  },

  // Major Nodes
  "A2": {
    xOffset: -60 - 50,
    yOffset: 5 - 25,
    type: "major",
    parent: "basic",
    children: ["1-1"],
  },
  "A4": {
    xOffset: 60 + 50,
    yOffset: 5 - 25,
    type: "major",
    parent: "skill",
    children: ["2-2"],
  },
  "A6": {
    xOffset: 0,
    yOffset: -50 - 50,
    type: "major",
    parent: "talent",
    children: ["1-3", "3-2"],
  },

  // Minor Nodes
  "1-1": {
    xOffset: -60 - 50 - 50,
    yOffset: 5 - 25 + 40,
    type: "minor",
    parent: "A2",
    children: ["2-1"],
  },
  "2-1": {
    xOffset: -60 - 50 - 50 + 30,
    yOffset: 5 - 25 + 40 + 40,
    type: "minor",
    parent: "1-1",
    children: ["3-1"],
  },
  "3-1": {
    xOffset: -60 - 50 - 50 + 30 + 30,
    yOffset: 5 - 25 + 40 + 40 + 40,
    type: "minor",
    parent: "2-1",
  },
  
  "2-2": {
    xOffset: 60 + 50 + 50,
    yOffset: 5 - 25 + 40,
    type: "minor",
    parent: "A4",
    children: ["1-2"],
  },
  "1-2": {
    xOffset: 60 + 50 + 50 - 30,
    yOffset: 5 - 25 + 40 + 40,
    type: "minor",
    parent: "2-2",
    children: ["2-3"],
  },
  "2-3": {
    xOffset: 60 + 50 + 50 - 30 - 30,
    yOffset: 5 - 25 + 40 + 40 + 40,
    type: "minor",
    parent: "1-2",
  },

  "1-3": {
    xOffset: 65,
    yOffset: -50 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  "3-2": {
    xOffset: -65,
    yOffset: -50 - 50 + 5,
    type: "minor",
    parent: "A6",
  },
  
  "2-4": {
    xOffset: 0,
    yOffset: 50 + 40,
    type: "minor",
    parent: "tech",
    children: ["2-5"],
  },
  "2-5": {
    xOffset: 0,
    yOffset: 50 + 40 + 40,
    type: "minor",
    parent: "2-4",
  },
};
