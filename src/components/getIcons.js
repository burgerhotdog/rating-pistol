import GI from "../assets/gi1/GI"
import HSR from "../assets/HSR/HSR"
import WW from "../assets/WW/WW"
import ZZZ from "../assets/ZZZ/ZZZ"

export default (gameType) => {
  const data = { GI, HSR, WW, ZZZ };
  return data[gameType];
};
