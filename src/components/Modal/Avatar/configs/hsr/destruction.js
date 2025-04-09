export default {
  "001": { // Basic Attack
    x: 190,
    y: 285,
    parent: "003",
  },
  "002": { // Skill
    x: 410,
    y: 285,
    parent: "003",
  },
  "003": { // Ultimate
    x: 300,
    y: 300,
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
    y: 405,
    parent: "003",
    children: ["101", "102", "201"],
  },

  "101": { // Bonus Ability A2
    x: 185,
    y: 415,
    parent: "007",
    children: ["202"],
  },
  "102": { // Bonus Ability A4
    x: 415,
    y: 415,
    parent: "007",
    children: ["205"],
  },
  "103": { // Bonus Ability A6
    x: 300,
    y: 140,
    parent: "004",
    children: ["208"],
  },

  "201": {
    x: 300,
    y: 490,
    parent: "007",
  },
  "203": {
    x: 40,
    y: 300,
    parent: "202",
    children: ["204"],
  },
  "205": {
    x: 495,
    y: 365,
    parent: "102",
    children: ["206"],
  },
  "207": {
    x: 495,
    y: 210,
    parent: "206",
  },
  "210": {
    x: 415,
    y: 90,
    parent: "208",
  },

  "202": {
    x: 105,
    y: 365,
    parent: "101",
    children: ["203"],
  },
  "206": {
    x: 560,
    y: 300,
    parent: "205",
    children: ["207"],
  },
  "209": {
    x: 185,
    y: 90,
    parent: "208",
  },

  "204": {
    x: 105,
    y: 210,
    parent: "203",
  },
  "208": {
    x: 300,
    y: 70,
    parent: "103",
    children: ["210", "209"],
  },
};
