export default {
  "001": { // Normal Attack
    x: 100,
    y: 50,
    children: ["002"],
  },
  "002": { // Elemental Skill
    x: 100,
    y: 150,
    parent: "001",
    children: ["003"],
  },
  "003": { // Elemental Burst
    x: 100,
    y: 250,
    parent: "002",
  },
};
