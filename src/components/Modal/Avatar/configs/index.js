import gi_nodes from "./gi";
import hsr_nodes from "./hsr";
import ww_nodes from "./ww";
import zzz_nodes from "./zzz";

export default {
  gi: {
    width: 200,
    height: 300,
    skillRankBonus: [3, 3, 3],
    nodes: gi_nodes,
  },
  hsr: {
    width: 600,
    height: 600,
    skillRankBonus: [1, 2, 2, 2, 1, 1],
    nodes: hsr_nodes,
  },
  ww: {
    width: 600,
    height: 400,
    nodes: ww_nodes,
  },
  zzz: {
    width: 600,
    height: 300,
    skillRankBonus: [2, 2, 2, 2, 2],
    nodes: zzz_nodes,
  },
};
