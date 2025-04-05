export default {
    // Skill Nodes
    "001": {
      x: 100,
      y: 330,
      children: ["203"],
    },
    "002": {
      x: 200,
      y: 280,
      children: ["201"],
    },
    "004": {
      x: 300,
      y: 250,
      children: ["101"],
    },
    "003": {
      x: 400,
      y: 280,
      children: ["202"],
    },
    "005": {
      x: 500,
      y: 330,
      children: ["204"],
    },
    "007": {
      x: 300,
      y: 350,
    },
  
    // Major Nodes
    "101": {
      x: 300,
      y: 150,
      parent: "004",
      children: ["102"],
    },
    "102": {
      x: 300,
      y: 50,
      parent: "101",
    },
  
    // Minor Nodes
    "201": {
      x: 200,
      y: 180,
      parent: "002",
      children: ["205"],
    },
    "202": {
      x: 400,
      y: 180,
      parent: "003",
      children: ["206"],
    },

    "203": {
      x: 100,
      y: 230,
      parent: "001",
      children: ["207"],
    },
    "204": {
      x: 500,
      y: 230,
      parent: "005",
      children: ["208"],
    },

    "205": {
      x: 200,
      y: 80,
      parent: "201",
    },
    "206": {
      x: 400,
      y: 80,
      parent: "202",
    },

    "207": {
      x: 100,
      y: 130,
      parent: "203",
    },
    "208": {
      x: 500,
      y: 130,
      parent: "204",
    },
  };
  