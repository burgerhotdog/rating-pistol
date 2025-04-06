export default {
  // Skill Nodes
  "001": {
    x: 100,
    y: 50,
    children: ["002"],
  },
  "002": {
    x: 100,
    y: 150,
    parent: "001",
    children: ["003"],
  },
  "003": {
    x: 100,
    y: 250,
    parent: "002",
  },
};
