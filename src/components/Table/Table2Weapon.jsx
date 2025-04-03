import React from "react";
import { Stack, Badge, Avatar, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ASSETS, DATA } from "../importData";

const Table2Weapon = ({ gameId, setPipe, id, data }) => {
  const { WEAPON_IMGS } = ASSETS[gameId];
  const { WEAPON_PREFIX, HEADERS } = DATA[gameId];

  const openModal = () => setPipe({ type: "weapon", id, data });
  
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
          badgeContent={<strong>{WEAPON_PREFIX}{data.weaponRank}</strong>}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.4)",
            },
          }}
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
