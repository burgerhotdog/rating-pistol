import React from "react";
import { Badge, Avatar, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table2Weapon = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { generalData } = getData[gameId];
  const { SECTIONS, WEAPON_RANK_PREFIX } = generalData;
  const { weaponIcons } = getIcons[gameId];

  const openModal = () => {
    setModalPipe({
      type: "weapon",
      id,
      data,
    });
  };
  
  if (!data.weaponId) {
    return (
      <Tooltip title={`Add ${SECTIONS[1]}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${SECTIONS[1]}`} arrow>
      <Badge
        onClick={openModal}
        badgeContent={
          <strong>{WEAPON_RANK_PREFIX}{data.weaponRank}</strong>
        }
      >
        <Avatar
          alt={data.weaponId}
          src={weaponIcons[`./${data.weaponId}.webp`]?.default}
        />
      </Badge>
    </Tooltip>
  );
};

export default Table2Weapon;
