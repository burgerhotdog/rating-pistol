import GI_CHARACTERS from "../data/GI_CHARACTERS";
import GI_WEAPONS from "../data/GI_WEAPONS";
import { GI_SUBSTATS } from "../data/GI_STATS";
import HSR_CHARACTERS from "../data/HSR_CHARACTERS";
import HSR_WEAPONS from "../data/HSR_WEAPONS";
import { HSR_SUBSTATS } from "../data/HSR_STATS";
import ZZZ_CHARACTERS from "../data/ZZZ_CHARACTERS";
import ZZZ_WEAPONS from "../data/ZZZ_WEAPONS";
import { ZZZ_SUBSTATS } from "../data/ZZZ_STATS";
import WW_CHARACTERS from "../data/WW_CHARACTERS";
import WW_WEAPONS from "../data/WW_WEAPONS";
import { WW_SUBSTATS } from "../data/WW_STATS";

const GAME_DATA = {
  GI: {
    CHARACTERS: GI_CHARACTERS,
    WEAPONS: GI_WEAPONS,
    SUBSTATS: GI_SUBSTATS,
  },
  HSR: {
    CHARACTERS: HSR_CHARACTERS,
    WEAPONS: HSR_WEAPONS,
    SUBSTATS: HSR_SUBSTATS,
  },
  ZZZ: {
    CHARACTERS: ZZZ_CHARACTERS,
    WEAPONS: ZZZ_WEAPONS,
    SUBSTATS: ZZZ_SUBSTATS,
  },
  WW: {
    CHARACTERS: WW_CHARACTERS,
    WEAPONS: WW_WEAPONS,
    SUBSTATS: WW_SUBSTATS,
  },
};

export default GAME_DATA;
