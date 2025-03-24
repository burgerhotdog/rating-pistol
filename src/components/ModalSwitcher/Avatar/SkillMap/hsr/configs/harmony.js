export default {
  // Skill Nodes
  "001": {
    x: 205,
    y: 270,
    parent: "004",
    children: ["101"],
  },
  "002": {
    x: 395,
    y: 270,
    parent: "004",
    children: ["102"],
  },
  "003": {
    x: 300,
    y: 340,
    parent: "004",
    children: ["007"],
  },
  "004": {
    x: 300,
    y: 255,
    children: ["001", "002", "ultimate", "103"],
  },
  "007": {
    x: 300,
    y: 430,
    parent: "003",
    children: ["201"],
  },

  // Major Nodes
  "101": {
    x: 85,
    y: 320,
    parent: "001",
    children: ["202"],
  },
  "102": {
    x: 515,
    y: 320,
    parent: "002",
    children: ["205"],
  },
  "103": {
    x: 300,
    y: 150,
    parent: "004",
    children: ["208"],
  },

  // Minor Nodes
  "201": {
    x: 300,
    y: 500,
    parent: "007",
    children: ["207", "204"],
  },
  "203": {
    x: 115,
    y: 200,
    parent: "202",
  },
  "205": {
    x: 475,
    y: 395,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 405,
    y: 480,
    parent: "201",
  },
  "210": {
    x: 410,
    y: 90,
    parent: "208",
  },

  "202": {
    x: 35,
    y: 250,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 395,
    y: 365,
    parent: "205",
  },
  "209": {
    x: 190,
    y: 90,
    parent: "208",
  },

  "204": {
    x: 195,
    y: 480,
    parent: "201",
  },
  "208": {
    x: 300,
    y: 70,
    parent: "103",
    children: ["210", "209"],
  },
};
