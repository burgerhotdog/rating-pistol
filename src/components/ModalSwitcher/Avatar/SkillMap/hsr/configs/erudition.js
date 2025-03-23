export default {
  // Skill Nodes
  "001": {
    x: 205,
    y: 300,
    parent: "003",
    children: ["101"],
  },
  "002": {
    x: 395,
    y: 300,
    parent: "003",
    children: ["102"],
  },
  "003": {
    x: 300,
    y: 300,
    children: ["001", "002", "004", "007"],
  },
  "004": {
    x: 300,
    y: 190,
    parent: "003",
    children: ["103"],
  },
  "007": {
    x: 300,
    y: 455,
    parent: "003",
    children: ["201", "210"],
  },

  // Major Nodes
  "101": {
    x: 130,
    y: 300,
    parent: "001",
    children: ["202"],
  },
  "102": {
    x: 470,
    y: 300,
    parent: "002",
    children: ["205"],
  },
  "103": {
    x: 300,
    y: 65,
    parent: "004",
    children: ["209", "208"],
  },

  // Minor Nodes
  "201": {
    x: 210,
    y: 445,
    parent: "007",
  },
  "203": {
    x: 80,
    y: 380,
    parent: "202",
  },
  "205": {
    x: 540,
    y: 300,
    parent: "102",
    children: ["207", "206"],
  },
  "207": {
    x: 520,
    y: 220,
    parent: "205",
  },
  "210": {
    x: 390,
    y: 445,
    parent: "007",
  },

  "202": {
    x: 60,
    y: 300,
    parent: "101",
    children: ["203", "204"],
  },
  "206": {
    x: 520,
    y: 380,
    parent: "205",
  },
  "209": {
    x: 415,
    y: 90,
    parent: "103",
  },

  "204": {
    x: 80,
    y: 220,
    parent: "202",
  },
  "208": {
    x: 185,
    y: 90,
    parent: "103",
  },
};
