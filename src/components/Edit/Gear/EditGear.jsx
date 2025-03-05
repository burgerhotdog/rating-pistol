import React from "react";
import {
  Grid2 as Grid,
  Stack,
  Box,
  Divider,
  Card,
  Autocomplete,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import EditGearPiece from "./EditGearPiece";

const EditGear = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const { INFO, SETS } = gameData;
  const { setsIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  const hasExtra = gameType === "HSR" || gameType === "ZZZ";

  const setOptions = (setType) => {
    return Object.keys(SETS)
      .filter(id => {
        return setType === "set" ?
          gameType === "HSR" ?
            id.substring(0, 1) === "1" :
            true :
          gameType === "HSR" ?
            id.substring(0, 1) === "3" :
            id !== action.data.info.set[0].id;
      })
      .sort((a, b) => {
        const rarityA = SETS[a].rarity;
        const rarityB = SETS[b].rarity;
        return rarityA !== rarityB ?
          rarityB - rarityA :
          SETS[a].name.localeCompare(SETS[b].name);
      });
  };

  const handleSet = (newValue, setType) => {
    const clearSetExtra = gameType === "ZZZ" && setType === "set";
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          ...(
            setType === "set" ?
              { set: [{ id: newValue || "", bonus: "" }, { id: "", bonus: "" }] } :
              { setExtra: { id: newValue || "", bonus: "" } }
          ),
          ...(clearSetExtra && prev.data.info.setExtra.id === newValue ? { setExtra: { id: "", bonus: "" } } : {}),
        },
      },
    }));
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={hasExtra ? 8 : 12}>
          <Stack spacing={2}>
            <Autocomplete
              size="small"
              value={action?.data?.info?.set[0]?.id || ""}
              options={setOptions("set")}
              getOptionLabel={(id) => SETS[id]?.name || ""}
              onChange={(_, newValue) => handleSet(newValue, "set")}
              renderOption={(props, id) => {
                const { key, ...idProps } = props;
                const rarity = SETS[id]?.rarity;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{
                      "& > img": { mr: 2, flexShrink: 0 },
                      color: rarityColor[rarity],
                    }}
                    {...idProps}
                  >
                    <Box
                      component="img"
                      loading="lazy"
                      src={setsIcons[`../assets/sets/${gameType}/${id}.webp`]?.default}
                      alt={""}
                      sx={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    {SETS[id]?.name || ""}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Set"
                />
              )}
              fullWidth
              disableClearable={action?.data?.info?.set[0]?.id === ""}
            />
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 150,
                p: 2
              }}
            >
              {action?.data?.info?.set[0]?.id ? (
                <Grid container spacing={1}>
                  <Grid size={4}>
                    <Stack alignItems="center">
                      <Box
                        component="img"
                        src={setsIcons[`../assets/sets/${gameType}/${action.data.info.set[0].id}.webp`]?.default}
                        alt=""
                        sx={{ width: 100, height: 100, objectFit: "contain" }}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={8}>
                    <Stack>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {SETS[action.data.info.set[0].id].name}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {SETS[action.data.info.set[0].id].desc}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1" color="text.disabled">
                  Select 1st set
                </Typography>
              )}
            </Card>
          </Stack>
        </Grid>
        {hasExtra && (
          <Grid size={4}>
            <Stack spacing={2}>
              <Autocomplete
                size="small"
                value={action?.data?.info?.setExtra?.id || ""}
                options={setOptions("setExtra")}
                getOptionLabel={(id) => SETS[id]?.name || ""}
                onChange={(_, newValue) => handleSet(newValue, "setExtra")}
                renderOption={(props, id) => {
                  const { key, ...idProps } = props;
                  const rarity = SETS[id]?.rarity;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                        color: rarityColor[rarity],
                      }}
                      {...idProps}
                    >
                      <Box
                        component="img"
                        loading="lazy"
                        src={setsIcons[`../assets/sets/${gameType}/${id}.webp`]?.default}
                        alt={""}
                        sx={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {SETS[id]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Set"
                  />
                )}
                fullWidth
                disableClearable={action?.data?.info?.setExtra?.id === ""}
              />
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 150,
                  p: 2
                }}
              >
                {action?.data?.info?.setExtra?.id ? (
                  <Grid container spacing={1}>
                    <Grid size={4}>
                      <Stack alignItems="center">
                        <Box
                          component="img"
                          src={setsIcons[`../assets/sets/${gameType}/${action.data.info.setExtra.id}.webp`]?.default}
                          alt=""
                          sx={{ width: 100, height: 100, objectFit: "contain" }}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={8}>
                      <Stack>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {SETS[action.data.info.setExtra.id].name}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                          {SETS[action.data.info.setExtra.id].desc}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.disabled">
                    Select 2nd set
                  </Typography>
                )}
              </Card>
            </Stack>
          </Grid>
        )}
      </Grid>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
          <EditGearPiece
            key={mainIndex}
            gameType={gameType}
            gameData={gameData}
            action={action}
            setAction={setAction}
            mainIndex={mainIndex}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default EditGear;
