export default {
  "001": { // Basic
    x: 100,
    y: 250,
    children: ["004"],
  },
  "004": { // Dodge
    x: 200,
    y: 250,
    parent: "001",
    children: ["005"],
  },
  "005": { // Assist
    x: 300,
    y: 250,
    parent: "004",
    children: ["002"],
  },
  "002": { // EX Special
    x: 400,
    y: 250,
    parent: "005",
    children: ["003"],
  },
  "003": { // Chain & Ultimate
    x: 500,
    y: 250,
    parent: "002",
  },

  "101": { // Core A
    x: 150,
    y: 50,
    children: ["102"],
  },
  "102": { // Core B
    x: 150,
    y: 150,
    parent: "101",
    children: ["103"],
  },
  "103": { // Core C
    x: 250,
    y: 50,
    parent: "102",
    children: ["104"],
  },
  "104": { // Core D
    x: 250,
    y: 150,
    parent: "103",
    children: ["105"],
  },
  "105": { // Core E
    x: 350,
    y: 50,
    parent: "104",
    children: ["106"],
  },
  "106": { // Core F
    x: 350,
    y: 150,
    parent: "105",
  },
};
