import GI from "../data/gi/GI";
import HSR from "../data/HSR2/HSR";
import WW from "../data/WW2/WW";
import ZZZ from "../data/ZZZ2/ZZZ";

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
