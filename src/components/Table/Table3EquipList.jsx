import React, { useMemo } from "react";
import { Tooltip, Stack, Box, Typography } from "@mui/material";
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

  const openModal = () => {
    setModalPipe({
      type: "equip",
      id,
      data,
    });
  };

  const setBonuses = useMemo(() => getSetBonuses(gameId, data.equipList), [gameId, data.equipList]);

  if (!Object.keys(setBonuses).length) {
    return (
      <Tooltip title={`Add ${generalData.SECTIONS[2]}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  const sortedSetBonuses = useMemo(() => sortSetBonuses(gameId, setBonuses), [gameId, setBonuses]);

  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[2]}`} arrow>
      <Stack
        onClick={openModal}
        direction="row"
        justifyContent="center"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        {sortedSetBonuses.map(([setId, numBonus]) => (
          <Stack key={setId} direction="row" alignItems="end">
            <Box
              component="img"
              src={setIcons[`./${setId}.webp`]?.default}
              alt={setId}
              sx={{ width: 50, height: 50, objectFit: "contain" }}
            />
            
            <Typography>{`x${numBonus}`}</Typography>
          </Stack>
        ))}
      </Stack>
    </Tooltip>
  );
};

export default Table3EquipList;
