import { useMemo } from "react";
import { Paper, Grid, Box, Stack, Typography } from "@mui/material";
import { SET_ASSETS } from "@assets";
import { SET_DATA } from "@data";
import { getSetBonuses } from "@utils";

const PreviewSet = ({ gameId, equipList }) => {
  const setBonuses = useMemo(
    () => getSetBonuses(gameId, equipList),
    [equipList],
  );

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
        {setBonuses.map(([setId, numPc]) => {
          const srcFolder = SET_ASSETS[gameId][setId];
          const src = gameId === "gi"
            ? srcFolder["0"]
            : gameId === "hsr"
              ? SET_DATA[gameId][setId].type === "Relic"
                ? srcFolder["0"]
                : srcFolder["4"]
              : srcFolder;
          return (
            <Grid key={setId} size="grow" sx={{ minHeight: 150 }}>
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  alt={setId}
                  src={src}
                  sx={{ width: 75, height: 75, objectFit: "contain" }}
                />
                
                <Stack>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {SET_DATA[gameId][setId].name}
                  </Typography>

                  {Object.entries(SET_DATA[gameId][setId].desc)
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
          );
        })}
      </Grid>
    </Paper>
  );
};

export default PreviewSet;
