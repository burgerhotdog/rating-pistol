import React from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import getData from "../getData";
import getIcons from "../getIcons";

const TableGear = ({
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
      item: "gear",
      id,
      data,
    });
  };

  const sectionName = generalData.SECTION_NAMES[2];

  return (
    <Stack alignItems="center">
      <Tooltip title={`Edit ${sectionName}`} arrow>
        {data.set[0].id || data.setExtra.id ? (
          <Stack
            onClick={openModal}
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer" }}
          >
            {data.info.set[0].id && (
              <Box
                component="img"
                alt={data.set[0].id}
                src={setIcons[`./${data.set[0].id}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
            )}
            {data.info.set[1].id && (
              <Box
                component="img"
                alt={data.set[1].id}
                src={setIcons[`./${data.set[1].id}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
            )}
            {data.info.setExtra.id && (
              <Box
                component="img"
                alt={data.setExtra.id}
                src={setIcons[`./${data.setExtra.id}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
            )}
          </Stack>
        ) : (
          <Add onClick={openModal} cursor="pointer" />
        )}
      </Tooltip>
    </Stack>
  );
};

export default TableGear;
