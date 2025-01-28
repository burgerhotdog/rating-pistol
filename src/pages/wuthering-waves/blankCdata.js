const blankPiece = (mainstat = "") => ({
  mainstat,
  substats: Array(5).fill({ key: "", value: "" }),
});

const blankCdata = () => ({
  weapon: "",
  set: "",
  score: "",
  pieces: [
    blankPiece(),
    blankPiece(),
    blankPiece(),
    blankPiece(),
    blankPiece(),
  ],
});        

export default blankCdata;
