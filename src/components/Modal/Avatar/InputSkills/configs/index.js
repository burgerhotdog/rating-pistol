import gi_nodes from "./gi_nodes.json";
import ww_nodes from "./ww_nodes.json";
import zzz_nodes from "./zzz_nodes.json";

import Abundance from "./hsr_nodes/abundance.json";
import Destruction from "./hsr_nodes/destruction.json";
import Erudition from "./hsr_nodes/erudition.json";
import Harmony from "./hsr_nodes/harmony.json";
import Nihility from "./hsr_nodes/nihility.json";
import Preservation from "./hsr_nodes/preservation.json";
import Remembrance from "./hsr_nodes/remembrance.json";
import The_Hunt from "./hsr_nodes/the_hunt.json";
const hsr_nodes = { Abundance, Destruction, Erudition, Harmony, Nihility, Preservation, Remembrance, The_Hunt };

export default {
  gi: { width: 200, height: 300, nodes: gi_nodes },
  hsr: { width: 600, height: 600, nodes: hsr_nodes },
  ww: { width: 600, height: 400, nodes: ww_nodes },
  zzz: { width: 600, height: 300, nodes: zzz_nodes },
};
