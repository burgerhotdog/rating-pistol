import React from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import getData from "../getData";
import getIcons from "../getIcons";

const TableWeapon = ({
  gameType,
  setAction,
  id,
  data,
}) => {
  const { INFO } = getData(gameType);
  const { weaponIcons } = getIcons(gameType);
  const openModal = () => {
    setAction({
      type: "edit",
      item: "weapon",
      id,
      data,
    });
  };

  const addOrEdit = data.info.weapon ? "Edit " : "Add ";
  const sectionName = INFO.SECTION_NAMES[1];

  return (
    <Stack alignItems="center">
      <Tooltip title={`${addOrEdit} ${sectionName}`} arrow>
        {data.info.weapon ? (
          <Box
            onClick={openModal}
            component="img"
            alt={data.info.weapon}
            src={weaponIcons[`./${data.info.weapon}.webp`]?.default}
            sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
          />
        ) : (
          <Add onClick={openModal} cursor="pointer" />
        )}
      </Tooltip>
    </Stack>
  );
};

export default TableWeapon;
