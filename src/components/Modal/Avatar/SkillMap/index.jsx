import React from "react";
import GI from "./gi/Map";
import HSR from "./hsr/Map";
import WW from "./ww/Map";
import ZZZ from "./zzz/Map";

export default ({ gameId, pipe, setPipe }) => {
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

  switch (gameId) {
    case "gi":
      return (
        <GI
          skillMap={pipe.data.skillMap}
          editSkillMap={editSkillMap} 
        />
      );

    case "hsr":
      return (
        <HSR
          id={pipe.id}
          rank={pipe.data.rank}
          skillMap={pipe.data.skillMap}
          editSkillMap={editSkillMap}
        />
      );

    case "ww":
      return (
        <WW
          skillMap={pipe.data.skillMap}
          editSkillMap={editSkillMap}
        />
      );

    case "zzz":
      return (
        <ZZZ
          rank={pipe.data.rank}
          skillMap={pipe.data.skillMap}
          editSkillMap={editSkillMap}
        />
      );
  }
};
