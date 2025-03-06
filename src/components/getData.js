import gi from "../data/gi/gi";
import hsr from "../data/hsr/hsr";
import ww from "../data/ww/ww";
import zzz from "../data/zzz/zzz";

export default (gameId) => {
  const data = { gi, hsr, ww, zzz };
  return data[gameId];
};
