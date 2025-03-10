import React, { useMemo } from "react";
import {
  Card,
  Grid2 as Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import getData from "../../../getData"
import getIcons from "../../../getIcons";
import getSetBonuses from "../../../getSetBonuses";

const PreviewSet = ({ gameId, action }) => {
  const { equipData, setData } = getData[gameId];
  const { setIcons } = getIcons[gameId];
  const setBonuses = useMemo(() => getSetBonuses(gameId, action.data.equipList), [action.data.equipList]);

  if (!Object.keys(setBonuses).length) {
    return (
      <Card sx={{ p: 2 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ minHeight: 150 }}>
          <Typography variant="body1" color="text.disabled">
            No set bonuses
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {Object.entries(setBonuses).map(([setId, numPc]) => (
          <Grid key={setId} size="grow" sx={{ minHeight: 150 }}>
            <Stack direction="row" spacing={1}>
              <Box
                component="img"
                alt={setId}
                src={setIcons[`./${setId}.webp`]?.default}
                sx={{ width: 75, height: 75 }}
              />
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {setData[setId].name}
                </Typography>

                {Object.entries(setData[setId].desc)
                  .filter(([numBonus]) => numPc >= numBonus)
                  .map(([numBonus, effect]) => (
                    <Typography key={numBonus} variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      <strong>{`${numBonus}-pc: `}</strong>
                      {effect}
                    </Typography>
                  ))}
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default PreviewSet;
