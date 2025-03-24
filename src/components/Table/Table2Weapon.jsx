import React from "react";
import { Stack, Badge, Avatar, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getImgs from "../getImgs";

const Table2Weapon = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { WEAPON_PREFIX, HEADERS } = getData[gameId];
  const { WEAPON_IMGS } = getImgs[gameId];

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
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.4)",
            },
          }}
          badgeContent={
            <strong>{WEAPON_PREFIX}{data.weaponRank}</strong>
          }
        >
          <Avatar
            alt={data.weaponId}
            src={WEAPON_IMGS[`./${data.weaponId}.webp`]?.default}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table2Weapon;
