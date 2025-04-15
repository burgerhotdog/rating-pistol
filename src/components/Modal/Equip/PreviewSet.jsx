import React, { useMemo } from "react";
import {
  Paper,
  Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import SET_ASSETS from "@assets/dynamic/set";
import SETS from "@data/dynamic/sets";
import getSetBonuses from "@utils/getSetBonuses";

const PreviewSet = ({ gameId, pipe }) => {

  const setBonuses = useMemo(() => (
    getSetBonuses(gameId, pipe.data.equipList)
  ), [pipe.data.equipList]);

  if (!Object.keys(setBonuses).length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ minHeight: 150 }}>
          <Typography variant="body1" color="text.disabled">
            No set bonuses
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {setBonuses.map(([setId, numPc]) => (
          <Grid key={setId} size="grow" sx={{ minHeight: 150 }}>
            <Stack direction="row" spacing={1}>
              <Box
                component="img"
                alt={setId}
                src={SET_ASSETS[`./${gameId}/${setId}.webp`]?.default}
                sx={{ width: 75, height: 75, objectFit: "contain" }}
              />
              
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {SETS[gameId][setId].name}
                </Typography>

                {Object.entries(SETS[gameId][setId].desc)
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
    </Paper>
  );
};

export default PreviewSet;
