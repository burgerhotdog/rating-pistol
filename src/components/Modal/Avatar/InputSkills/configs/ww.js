export default {
  "001": { // Normal Attack
    x: 100,
    y: 330,
    children: ["203"],
  },
  "002": { // Resonance SKill
    x: 200,
    y: 280,
    children: ["201"],
  },
  "004": { // Forte Circuit
    x: 300,
    y: 250,
    children: ["101"],
  },
  "003": { // Resonance Liberation
    x: 400,
    y: 280,
    children: ["202"],
  },
  "005": { // Intro Skill
    x: 500,
    y: 330,
    children: ["204"],
  },
  "007": { // Outro Skill
    x: 300,
    y: 350,
  },

  "101": { // Bonus Ability 1
    x: 300,
    y: 150,
    parent: "004",
    children: ["102"],
  },
  "102": { // Bonus Ability 2
    x: 300,
    y: 50,
    parent: "101",
  },

  "201": { // Level 50
    x: 200,
    y: 180,
    parent: "002",
    children: ["205"],
  },
  "202": { // Level 50
    x: 400,
    y: 180,
    parent: "003",
    children: ["206"],
  },
  "203": { // Level 60
    x: 100,
    y: 230,
    parent: "001",
    children: ["207"],
  },
  "204": { // Level 60
    x: 500,
    y: 230,
    parent: "005",
    children: ["208"],
  },
  "205": { // Level 70
    x: 200,
    y: 80,
    parent: "201",
  },
  "206": { // Level 70
    x: 400,
    y: 80,
    parent: "202",
  },
  "207": { // Level 80
    x: 100,
    y: 130,
    parent: "203",
  },
  "208": { // Level 80
    x: 500,
    y: 130,
    parent: "204",
  },
};
