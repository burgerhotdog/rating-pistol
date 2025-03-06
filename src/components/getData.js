import GI from "../data/gi/GI";
import HSR from "../data/hsr/HSR";
import WW from "../data/ww/WW";
import ZZZ from "../data/zzz/ZZZ";

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
