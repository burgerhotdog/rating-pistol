import React from "react";
import {
  Grid2 as Grid,
  Box,
  Stack,
  Card,
  Typography,
} from "@mui/material";
import getData from "../../../getData";
import getIcons from "../../../getIcons";

const WeaponCard = ({ gameId, action }) => {
  const { generalData, weaponData } = getData(gameId);
  const { weaponIcons } = getIcons(gameId);

  return (
    <Card
      sx={{
        width: 700,
        p: 2
      }}
    >
      {action?.data.weaponId ? (
        <Grid container spacing={1}>
          <Grid size={4}>
            <Stack alignItems="center">
              <Box
                component="img"
                src={weaponIcons[`./${action.data.weaponId}.webp`]?.default}
                alt=""
                sx={{ width: 200, height: 200, objectFit: "contain" }}
              />
            </Stack>
          </Grid>
          <Grid size={8}>
            <Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {weaponData[action.data.weaponId].name}
              </Typography>
              <Typography variant="body2">
                {gameId === "hsr"
                  && `Base HP: ${weaponData[action.data.weaponId].base._HP}`}
              </Typography>
              <Typography variant="body2">
                {`Base ATK: ${weaponData[action.data.weaponId].base._ATK}`}
              </Typography>
              <Typography variant="body2">
                {gameId === "hsr"
                  ? `Base DEF: ${weaponData[action.data.weaponId].base._DEF}`
                  : weaponData[action.data.weaponId].substat}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                {weaponData[action.data.weaponId].subtitle}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {weaponData[action.data.weaponId].desc}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: 100 }}
        >
          <Typography variant="body1" color="text.disabled">
            No {generalData.SECTION_NAMES[1]} Selected
          </Typography>
        </Stack>
      )}
    </Card>
  );
};

export default WeaponCard;
