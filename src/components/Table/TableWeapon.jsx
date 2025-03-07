import React from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const TableWeapon = ({
  gameId,
  setAction,
  id,
  data,
}) => {
  const { generalData } = getData(gameId);
  const { weaponIcons } = getIcons(gameId);
  const openModal = () => {
    setAction({
      type: "edit",
      item: "weapon",
      id,
      data,
    });
  };

  const sectionName = generalData.SECTION_NAMES[1];

  return (
    <Stack alignItems="center">
      <Tooltip title={`Edit ${sectionName}`} arrow>
        {data.weaponId ? (
          <Box
            onClick={openModal}
            component="img"
            alt={data.weaponId}
            src={weaponIcons[`./${data.weaponId}.webp`]?.default}
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
