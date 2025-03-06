import GI from "../data/gi/GI";
import HSR from "../data/HSR/HSR";
import WW from "../data/WW/WW";
import ZZZ from "../data/ZZZ/ZZZ";

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
