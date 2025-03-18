import React from "react";
import GI from "./gi-map";
import HSR from "./hsr-map";
import WW from "./ww-map";
import ZZZ from "./zzz-map";

const SkillMapSwitcher = ({
  gameId,
  modalPipe,
  setModalPipe,
}) => {
  const handleSkill = (event) => {
    const { name, value } = event.target;

    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skillMap: {
          ...prev.data.skillMap,
          [name]: value,
        },
      },
    }));
  };

  let mapContent = null;
  switch (gameId) {
    case "gi":
      mapContent = (
        <GI
          gameId={gameId}
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "hsr":
      mapContent = (
        <HSR
          gameId={gameId}
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "ww":
      mapContent = (
        <WW
          gameId={gameId}
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "zzz":
      mapContent = (
        <ZZZ
          gameId={gameId}
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;
  }

  return mapContent;
};

export default SkillMapSwitcher;
