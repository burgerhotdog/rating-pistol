const blankPiece = (mainstat = "") => ({
  mainstat,
  substats: Array(4).fill({ key: "", value: "" }),
});

const blankCdata = () => ({
  weapon: "",
  set: "",
  score: "",
  pieces: [
    blankPiece("HP"),
    blankPiece("ATK"),
    blankPiece(),
    blankPiece(),
    blankPiece(),
  ],
});

export default blankCdata;
