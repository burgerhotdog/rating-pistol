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

const SetCard = ({ gameId, action }) => {
  const { equipData, setData } = getData[gameId];
  const { setIcons } = getIcons[gameId];
  const setBonuses = useMemo(() => getSetBonuses(gameId, action.data.equipList), [action.data.equipList]);

  if (!Object.keys(setBonuses).length) {
    return (
      <Card sx={{ width: 700, p: 2 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ minHeight: 150 }}>
          <Typography variant="body1" color="text.disabled">
            No set bonuses
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ width: 700, p: 2 }}>
      <Grid container spacing={1}>
        {Object.entries(setBonuses).map(([setId, numBonus]) => (
          <Grid key={setId} size={4}>
            <Grid container spacing={1}>
              <Grid size={4}>
                <Box
                  component="img"
                  alt={setId}
                  src={setIcons[`./${setId}.webp`]?.default}
                  sx={{ width: 100, height: 100, objectFit: "contain" }}
                />
              </Grid>
              <Grid size={8}>
                <Stack>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {setData[setId].name}
                  </Typography>

                </Stack>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default SetCard;
