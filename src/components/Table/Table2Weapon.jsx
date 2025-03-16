import React from "react";
import { Stack, Badge, Avatar, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table2Weapon = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { WEAPON_PREFIX, HEADERS } = getData[gameId];
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
      <Tooltip title={`Add ${HEADERS.weapon}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${HEADERS.weapon}`} arrow>
      <Stack display="inline-flex">
        <Badge
          onClick={openModal}
          badgeContent={
            <strong>{WEAPON_PREFIX}{data.weaponRank}</strong>
          }
        >
          <Avatar
            alt={data.weaponId}
            src={weaponIcons[`./${data.weaponId}.webp`]?.default}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table2Weapon;
