import React, { useMemo } from "react";
import { Tooltip, Stack, Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";
import getSetBonuses from "../getSetBonuses";

const Table3EquipList = ({
  gameId,
  setAction,
  id,
  data,
}) => {
  const { generalData } = getData[gameId];
  const { setIcons } = getIcons[gameId];
  const setBonuses = useMemo(() => getSetBonuses(gameId, data.equipList), [gameId, data.equipList]);
  
  const openModal = () => {
    setAction({
      type: "edit",
      item: "equipList",
      id,
      data,
    });
  };


  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[2]}`} arrow>
      {Object.keys(setBonuses).length ? (
        <Stack
          onClick={openModal}
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          {Object.entries(setBonuses).map(([setId, numBonus]) => (
            <Stack key={setId} direction="row" alignItems="end">
              <Box
                component="img"
                alt={setId}
                src={setIcons[`./${setId}.webp`]?.default}
                sx={{ width: 50, height: 50 }}
              />
              <Typography>
                {`x${numBonus}`}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Add onClick={openModal} cursor="pointer" />
      )}
    </Tooltip>
  );
};

export default Table3EquipList;
