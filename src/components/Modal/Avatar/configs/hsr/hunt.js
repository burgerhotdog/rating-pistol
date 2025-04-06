export default {
  "001": { // Basic Attack
    x: 200,
    y: 260,
    parent: "003",
    children: ["204"],
  },
  "002": { // Skill
    x: 400,
    y: 260,
    parent: "003",
    children: ["207"],
  },
  "003": { // Ultimate
    x: 300,
    y: 310,
    children: ["001", "002", "004", "007"],
  },
  "004": { // Talent
    x: 300,
    y: 210,
    parent: "003",
    children: ["103"],
  },
  "007": { // Technique
    x: 300,
    y: 395,
    parent: "003",
    children: ["101", "102", "201"],
  },

  "101": { // Bonus Ability A2
    x: 195,
    y: 405,
    parent: "007",
    children: ["202"],
  },
  "102": { // Bonus Ability A4
    x: 405,
    y: 405,
    parent: "007",
    children: ["205"],
  },
  "103": { // Bonus Ability A6
    x: 300,
    y: 135,
    parent: "004",
    children: ["208"],
  },

  "201": {
    x: 300,
    y: 500,
    parent: "007",
  },
  "203": {
    x: 55,
    y: 270,
    parent: "202",
  },
  "205": {
    x: 475,
    y: 335,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 475,
    y: 180,
    parent: "002",
  },
  "210": {
    x: 415,
    y: 90,
    parent: "208",
  },

  "202": {
    x: 125,
    y: 335,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 545,
    y: 270,
    parent: "205",
  },
  "209": {
    x: 185,
    y: 90,
    parent: "208",
  },

  "204": {
    x: 125,
    y: 180,
    parent: "001",
  },
  "208": {
    x: 300,
    y: 70,
    parent: "103",
    children: ["210", "209"],
  },
};
