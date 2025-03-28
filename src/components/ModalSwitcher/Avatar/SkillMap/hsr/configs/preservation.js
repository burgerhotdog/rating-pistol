export default {
  // Skill Nodes
  "001": {
    x: 205,
    y: 310,
    parent: "003",
    children: ["204"],
  },
  "002": {
    x: 395,
    y: 310,
    parent: "003",
    children: ["207"],
  },
  "003": {
    x: 300,
    y: 300,
    children: ["001", "002", "004", "007"],
  },
  "004": {
    x: 300,
    y: 210,
    parent: "003",
    children: ["103"],
  },
  "007": {
    x: 300,
    y: 410,
    parent: "003",
    children: ["201"],
  },

  // Major Nodes
  "101": {
    x: 190,
    y: 485,
    parent: "201",
    children: ["202"],
  },
  "102": {
    x: 410,
    y: 485,
    parent: "201",
    children: ["205"],
  },
  "103": {
    x: 300,
    y: 140,
    parent: "004",
    children: ["208"],
  },

  // Minor Nodes
  "201": {
    x: 300,
    y: 480,
    parent: "007",
    children: ["101", "102"],
  },
  "203": {
    x: 35,
    y: 305,
    parent: "202",
  },
  "205": {
    x: 500,
    y: 385,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 480,
    y: 225,
    parent: "002",
  },
  "210": {
    x: 415,
    y: 90,
    parent: "208",
  },

  "202": {
    x: 100,
    y: 385,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 565,
    y: 305,
    parent: "205",
  },
  "209": {
    x: 185,
    y: 90,
    parent: "208",
  },

  "204": {
    x: 120,
    y: 225,
    parent: "001",
  },
  "208": {
    x: 300,
    y: 70,
    parent: "103",
    children: ["210", "209"],
  },
};
