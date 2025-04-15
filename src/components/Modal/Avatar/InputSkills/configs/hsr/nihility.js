export default {
  "001": { // Basic Attack
    x: 195,
    y: 250,
    parent: "003",
    children: ["101"],
  },
  "002": { // Skill
    x: 405,
    y: 250,
    parent: "003",
    children: ["102"],
  },
  "003": { // Ultimate
    x: 300,
    y: 240,
    children: ["001", "002", "004", "007"],
  },
  "004": { // Talent
    x: 300,
    y: 155,
    parent: "003",
    children: ["103"],
  },
  "007": { // Technique
    x: 300,
    y: 340,
    parent: "003",
    children: ["201"],
  },

  "101": { // Bonus Ability A2
    x: 115,
    y: 215,
    parent: "001",
    children: ["202"],
  },
  "102": { // Bonus Ability A4
    x: 485,
    y: 215,
    parent: "002",
    children: ["205"],
  },
  "103": { // Bonus Ability A6
    x: 300,
    y: 70,
    parent: "004",
    children: ["209", "208"],
  },

  "201": {
    x: 300,
    y: 415,
    parent: "007",
    children: ["210"],
  },
  "203": {
    x: 100,
    y: 380,
    parent: "202",
    children: ["204"],
  },
  "205": {
    x: 570,
    y: 300,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 430,
    y: 460,
    parent: "206",
  },
  "210": {
    x: 300,
    y: 490,
    parent: "201",
  },

  "202": {
    x: 30,
    y: 300,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 500,
    y: 380,
    parent: "205",
    children: ["207"],
  },
  "209": {
    x: 185,
    y: 90,
    parent: "103",
  },

  "204": {
    x: 170,
    y: 460,
    parent: "203",
  },
  "208": {
    x: 415,
    y: 90,
    parent: "103",
  },
};
