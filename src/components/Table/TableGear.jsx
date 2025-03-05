import React from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import getData from "../getData";
import getIcons from "../getIcons";

const TableGear = ({
  gameType,
  setAction,
  id,
  data,
}) => {
  const { INFO } = getData(gameType);
  const { setIcons } = getIcons(gameType);
  const openModal = () => {
    setAction({
      type: "edit",
      item: "gear",
      id,
      data,
    });
  };

  const addOrEdit = data.info.set[0].id || data.info.setExtra.id ? "Edit" : "Add";
  const sectionName = INFO.SECTION_NAMES[2];

  return (
    <Stack alignItems="center">
      <Tooltip title={`${addOrEdit} ${sectionName}`} arrow>
        {data.info.set[0].id || data.info.setExtra.id ? (
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
                alt={data.info.set[0].id}
                src={setIcons[`./${data.info.set[0].id}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
            )}
            {data.info.set[1].id && (
              <Box
                component="img"
                alt={data.info.set[1].id}
                src={setIcons[`./${data.info.set[1].id}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
            )}
            {data.info.setExtra.id && (
              <Box
                component="img"
                alt={data.info.setExtra.id}
                src={setIcons[`./${data.info.setExtra.id}.webp`]?.default}
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
