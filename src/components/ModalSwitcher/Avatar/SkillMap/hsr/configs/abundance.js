export default {
  // Skill Nodes
  "001": {
    x: 205,
    y: 285,
    parent: "003",
  },
  "002": {
    x: 395,
    y: 285,
    parent: "003",
  },
  "003": {
    x: 300,
    y: 305,
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
    y: 400,
    parent: "003",
    children: ["101", "102", "000"],
  },

  // Major Nodes
  "101": {
    x: 440,
    y: 430,
    parent: "007",
    children: ["202"],
  },
  "102": {
    x: 160,
    y: 430,
    parent: "007",
    children: ["205"],
  },
  "103": {
    x: 300,
    y: 70,
    parent: "004",
    children: ["209", "208"],
  },

  // Minor Nodes
  "201": {
    x: 350,
    y: 485,
    parent: "000",
  },
  "203": {
    x: 540,
    y: 290,
    parent: "202",
    children: ["204"],
  },
  "205": {
    x: 95,
    y: 350,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 130,
    y: 220,
    parent: "206",
  },
  "210": {
    x: 250,
    y: 485,
    parent: "000",
  },

  "202": {
    x: 505,
    y: 350,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 60,
    y: 290,
    parent: "205",
    children: ["207"],
  },
  "209": {
    x: 190,
    y: 95,
    parent: "103",
  },

  "204": {
    x: 470,
    y: 220,
    parent: "203",
  },
  "208": {
    x: 410,
    y: 95,
    parent: "103",
  },

  // Invis Nodes
  "000": {
    x: 300,
    y: 475,
    parent: "007",
    children: ["201", "210"],
  },
};
