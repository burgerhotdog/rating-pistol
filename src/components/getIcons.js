import gi from "../assets/gi/gi";
import hsr from "../assets/hsr/hsr";
import ww from "../assets/ww/ww";
import zzz from "../assets/zzz/zzz";

export default (gameType) => {
  const data = { gi, hsr, ww, zzz };
  return data[gameType];
};
