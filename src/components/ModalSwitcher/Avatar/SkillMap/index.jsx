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
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "hsr":
      mapContent = (
        <HSR
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "ww":
      mapContent = (
        <WW
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;

    case "zzz":
      mapContent = (
        <ZZZ
          modalPipe={modalPipe}
          handleSkill={handleSkill}
        />
      );
      break;
  }

  return mapContent;
};

export default Switcher;
