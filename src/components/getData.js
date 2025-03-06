import GI from "../data/gi/gi1";
import HSR from "../data/hsr/hsr1";
import WW from "../data/ww/ww1";
import ZZZ from "../data/zzz/zzz1";

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
