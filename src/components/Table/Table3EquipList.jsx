import React, { useMemo } from "react";
import { Tooltip, Badge, Avatar, Stack, Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getImgs from "../getImgs";
import getSetBonuses from "../getSetBonuses";
import sortSetBonuses from "../sortSetBonuses";

const Table3EquipList = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { HEADERS } = getData[gameId];
  const { SET_IMGS } = getImgs[gameId];
  
  const setBonuses = useMemo(() => getSetBonuses(gameId, data.equipList), [gameId, data.equipList]);
  const sortedSetBonuses = useMemo(() => sortSetBonuses(gameId, setBonuses), [gameId, setBonuses]);

  const openModal = () => {
    setModalPipe({
      type: "equip",
      id,
      data,
    });
  };

  if (!Object.keys(setBonuses).length) {
    return (
      <Tooltip title={`Add ${HEADERS.equips}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${HEADERS.equips}`} arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        {sortedSetBonuses.map(([setId, numBonus]) => (
          <Badge
            key={setId}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "rgba(20, 20, 20, 0.2)",
              },
            }}
            badgeContent={
              <strong>x{numBonus}</strong>
            }
          >
            <Avatar
              alt={setId}
              src={SET_IMGS[`./${setId}.webp`]?.default}
            />
          </Badge>
        ))}
      </Stack>
    </Tooltip>
  );
};

export default Table3EquipList;
