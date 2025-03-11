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
      <Tooltip title={`Add ${generalData.SECTIONS[2]}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[2]}`} arrow>
      <Stack direction="row" display="inline-flex" spacing={1}>
        {sortedSetBonuses.map(([setId, numBonus]) => (
          <Badge
            key={setId}
            onClick={openModal}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={`x${numBonus}`}
            cursor="pointer"
            sx={{ cursor: "pointer" }}
          >
            <Avatar
              variant="square"
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
