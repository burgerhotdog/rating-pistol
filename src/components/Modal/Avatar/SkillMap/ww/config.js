export default {
    // Skill Nodes
    "001": {
      x: 205,
      y: 285,
      children: ["203"],
    },
    "002": {
      x: 395,
      y: 285,
      children: ["201"],
    },
    "004": {
      x: 300,
      y: 210,
      children: ["101"],
    },
    "003": {
      x: 300,
      y: 305,
      children: ["202"],
    },
    "005": {
      x: 300,
      y: 400,
      children: ["204"],
    },
    "007": {
      x: 300,
      y: 475,
    },
  
    // Major Nodes
    "101": {
      x: 440,
      y: 430,
      parent: "004",
      children: ["102"],
    },
    "102": {
      x: 160,
      y: 430,
      parent: "101",
    },
  
    // Minor Nodes
    "201": {
      x: 350,
      y: 485,
      parent: "002",
      children: ["205"],
    },
    "202": {
      x: 540,
      y: 290,
      parent: "003",
      children: ["206"],
    },

    "203": {
      x: 95,
      y: 350,
      parent: "001",
      children: ["207"],
    },
    "204": {
      x: 130,
      y: 220,
      parent: "005",
      children: ["208"],
    },

    "205": {
      x: 250,
      y: 485,
      parent: "201",
    },
    "206": {
      x: 250,
      y: 485,
      parent: "202",
    },

    "207": {
      x: 250,
      y: 485,
      parent: "203",
    },
    "208": {
      x: 250,
      y: 485,
      parent: "204",
    },
  };
  