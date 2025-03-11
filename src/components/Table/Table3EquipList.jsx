import React, { useMemo } from "react";
import { Tooltip, Badge, Avatar, Stack, Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";
import getSetBonuses from "../getSetBonuses";
import sortSetBonuses from "../sortSetBonuses";

const Table3EquipList = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { generalData } = getData[gameId];
  const { SECTIONS } = generalData;
  const { setIcons } = getIcons[gameId];
  
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
      <Tooltip title={`Add ${SECTIONS[2]}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${SECTIONS[2]}`} arrow>
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
            badgeContent={
              <strong>x{numBonus}</strong>
            }
          >
            <Avatar
              alt={setId}
              src={setIcons[`./${setId}.webp`]?.default}
            />
          </Badge>
        ))}
      </Stack>
    </Tooltip>
  );
};

export default Table3EquipList;
