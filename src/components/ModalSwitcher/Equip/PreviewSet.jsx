import React, { useMemo } from "react";
import {
  Card,
  Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import getData from "../../getData"
import getImgs from "../../getImgs";
import getSetBonuses from "../../getSetBonuses";
import sortSetBonuses from "../../sortSetBonuses";

const PreviewSet = ({ gameId, modalPipe }) => {
  const { SET_DATA } = getData[gameId];
  const { SET_IMGS } = getImgs[gameId];

  const setBonuses = useMemo(() => getSetBonuses(gameId, modalPipe.data.equipList), [modalPipe.data.equipList]);
  const sortedSetBonuses = useMemo(() => sortSetBonuses(gameId, setBonuses), [gameId, setBonuses]);

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
        {sortedSetBonuses.map(([setId, numPc]) => (
          <Grid key={setId} size="grow" sx={{ minHeight: 150 }}>
            <Stack direction="row" spacing={1}>
              <Box
                component="img"
                alt={setId}
                src={SET_IMGS[`./${setId}.webp`]?.default}
                sx={{ width: 75, height: 75, objectFit: "contain" }}
              />
              
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {SET_DATA[setId].name}
                </Typography>

                {Object.entries(SET_DATA[setId].desc)
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
