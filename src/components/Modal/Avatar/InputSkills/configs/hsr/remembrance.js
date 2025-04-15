export default {
  "001": { // Basic Attack
    x: 220,
    y: 380,
    parent: "003",
    children: ["007"],
  },
  "002": { // Skill
    x: 405,
    y: 380,
    parent: "003",
    children: ["004"],
  },
  "003": { // Ultimate
    x: 310,
    y: 410,
    children: ["001", "002", "102"],
  },
  "004": { // Talent
    x: 455,
    y: 290,
    parent: "002",
    children: ["101"],
  },
  "007": { // Technique
    x: 170,
    y: 290,
    parent: "001",
    children: ["103", "201"],
  },
  "005": { // Memosprite Skill
    x: 310,
    y: 270,
    children: ["006"],
  },
  "006": { // Memosprite Talent
    x: 310,
    y: 155,
    parent: "005",
  },

  "101": { // Bonus Ability A2
    x: 550,
    y: 290,
    parent: "004",
    children: ["205", "206"],
  },
  "102": { // Bonus Ability A4
    x: 310,
    y: 495,
    parent: "003",
    children: ["207", "204"],
  },
  "103": { // Bonus Ability A6
    x: 210,
    y: 190,
    parent: "007",
    children: ["209"],
  },

  "201": {
    x: 60,
    y: 290,
    parent: "007",
    children: ["203", "202"],
  },
  "203": {
    x: 90,
    y: 380,
    parent: "201",
  },
  "205": {
    x: 540,
    y: 380,
    parent: "101",
  },
  "207": {
    x: 400,
    y: 480,
    parent: "102",
  },
  "210": {
    x: 360,
    y: 70,
    parent: "208",
  },

  "202": {
    x: 90,
    y: 195,
    parent: "201",
  },
  "206": {
    x: 530,
    y: 195,
    parent: "101",
  },
  "209": {
    x: 170,
    y: 105,
    parent: "103",
    children: ["208"],
  },

  "204": {
    x: 220,
    y: 480,
    parent: "102",
  },
  "208": {
    x: 260,
    y: 70,
    parent: "209",
    children: ["210"],
  },
};
