export default {
  // Skill Nodes
  "001": {
    x: 100,
    y: 250,
    children: ["004"],
  },
  "004": {
    x: 200,
    y: 250,
    parent: "001",
    children: ["005"],
  },
  "005": {
    x: 300,
    y: 250,
    parent: "004",
    children: ["002"],
  },
  "002": {
    x: 400,
    y: 250,
    parent: "005",
    children: ["003"],
  },
  "003": {
    x: 500,
    y: 250,
    parent: "002",
  },

  // Major Nodes
  "101": {
    x: 150,
    y: 50,
    children: ["102"],
  },
  "102": {
    x: 150,
    y: 150,
    parent: "101",
    children: ["103"],
  },
  "103": {
    x: 250,
    y: 50,
    parent: "102",
    children: ["104"],
  },
  "104": {
    x: 250,
    y: 150,
    parent: "103",
    children: ["105"],
  },
  "105": {
    x: 350,
    y: 50,
    parent: "104",
    children: ["106"],
  },
  "106": {
    x: 350,
    y: 150,
    parent: "105",
  },
};
