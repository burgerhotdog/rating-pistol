import GI from "../assets/gi/GI"
import HSR from "../assets/hsr/HSR"
import WW from "../assets/ww/WW"
import ZZZ from "../assets/zzz/ZZZ"

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
