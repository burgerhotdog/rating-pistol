import React from "react";
import GI from "./gi/Map";
import HSR from "./hsr/Map";
import WW from "./ww/Map";
import ZZZ from "./zzz/Map";

const Switcher = ({
  gameId,
  pipe,
  setPipe,
}) => {
  const editSkillMap = (skill, newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skillMap: {
          ...prev.data.skillMap,
          [skill]: newValue,
        },
      },
    }));
  };

  let mapContent = null;
  switch (gameId) {
    case "gi":
      mapContent = (<GI pipe={pipe} editSkillMap={editSkillMap} />);
      break;

    case "hsr":
      mapContent = (<HSR pipe={pipe} editSkillMap={editSkillMap} />);
      break;

    case "ww":
      mapContent = (<WW pipe={pipe} editSkillMap={editSkillMap} />);
      break;

    case "zzz":
      mapContent = (<ZZZ pipe={pipe} editSkillMap={editSkillMap} />);
      break;
  }

  return mapContent;
};

export default Switcher;
