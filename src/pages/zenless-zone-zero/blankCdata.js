const blankPiece = (mainstat = "") => ({
  mainstat,
  substats: Array(4).fill({ key: "", value: "" }),
});

const blankCdata = () => ({
  weapon: "",
  set1: "",
  set2: "",
  score: "",
  pieces: [
    blankPiece("HP"),
    blankPiece("ATK"),
    blankPiece("DEF"),
    blankPiece(),
    blankPiece(),
    blankPiece(),
  ],
});

export default blankCdata;
