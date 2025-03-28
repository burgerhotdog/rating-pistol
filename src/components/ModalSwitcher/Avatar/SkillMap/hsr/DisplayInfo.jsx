import React from "react"
import { Typography } from "@mui/material";
import getData from "../../../../getData";

const otherTypes = ["", "Bonus Ability", "Stat Bonus"];
const skillTypes = [
  "",
  "Basic ATK",
  "Skill",
  "Ultimate",
  "Talent",
  "Memosprite Skill",
  "Memosprite Talent",
  "Technique",
];

const DisplayInfo = ({ id, avatarId }) => {
  const { STAT_INDEX, AVATAR_DATA, MINOR_VALUE_TYPE, MINOR_VALUES } = getData["hsr"];
  const { skill, major, minor } = AVATAR_DATA[avatarId];
  const title = id[0] === "0" ? skillTypes[id[2]] : otherTypes[id[0]];
  const idIndex = Number(id.slice(1)) - 1;
  const subtitle =
    id[0] === "2" ? "" :
    id[0] === "1" ? major[idIndex] :
    skill[idIndex];

  const desc =
    id[0] === "2" ? `${STAT_INDEX[minor[idIndex]].name} increases by ${MINOR_VALUES[minor[idIndex]][MINOR_VALUE_TYPE[idIndex]]}` :
    "";
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="subtitle1" gutterBottom>
          {subtitle}
        </Typography>
      )}

      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
        {desc}
      </Typography>
    </>
  );
};

export default DisplayInfo;
