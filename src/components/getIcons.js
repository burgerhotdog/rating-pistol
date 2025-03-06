import GI from "../assets/gi/GI"
import HSR from "../assets/hsr1/HSR"
import WW from "../assets/ww1/WW"
import ZZZ from "../assets/zzz1/ZZZ"

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
