import React from "react";
import GI from "./gi/Map";
import HSR from "./hsr/Map";
import WW from "./ww/Map";
import ZZZ from "./zzz/Map";

const Switcher = ({
  gameId,
  modalPipe,
  setModalPipe,
}) => {
  const editSkillMap = (skill, newValue) => {
    setModalPipe((prev) => ({
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
      mapContent = (<GI modalPipe={modalPipe} editSkillMap={editSkillMap} />);
      break;

    case "hsr":
      mapContent = (<HSR modalPipe={modalPipe} editSkillMap={editSkillMap} />);
      break;

    case "ww":
      mapContent = (<WW modalPipe={modalPipe} editSkillMap={editSkillMap} />);
      break;

    case "zzz":
      mapContent = (<ZZZ modalPipe={modalPipe} editSkillMap={editSkillMap} />);
      break;
  }

  return mapContent;
};

export default Switcher;
