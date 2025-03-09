import React, { useMemo } from "react";
import { Tooltip, Stack, Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const TableEquipList = ({
  gameId,
  setAction,
  id,
  data,
}) => {
  const { generalData } = getData(gameId);
  const { setIcons } = getIcons(gameId);
  const openModal = () => {
    setAction({
      type: "edit",
      item: "equipList",
      id,
      data,
    });
  };

  const getSetBonuses = (equipList) => {
    const setCounts = {};
    equipList.forEach(({ setId }) => {
      if (setId) {
        setCounts[setId] = (setCounts[setId] || 0) + 1;
      }
    });
  
    const bonuses = {};
    const sets = Object.entries(setCounts).sort((a, b) => b[1] - a[1]);
  
    sets.forEach(([set, count]) => {
      if (count >= (gameId === "ww" ? 5 : 4)) {
        bonuses[set] = (gameId === "ww" ? 5 : 4);
      } else if (count >= 2) {
        bonuses[set] = 2;
      }
    });
  
    return bonuses;
  }

  const setBonuses = useMemo(() => getSetBonuses(data.equipList), [data.equipList]);

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
            <Stack direction="row" alignItems="end">
              <Box
                key={setId}
                component="img"
                alt={setId}
                src={setIcons[`./${setId}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
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

export default TableEquipList;
