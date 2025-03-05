import React from "react";
import { Box, Stack, TableCell, Tooltip, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";

const TableGear = ({
  gameType,
  gameData,
  setsIcons,
  setAction,
  id,
  data,
  isModalClosed,
}) => {
  const { INFO } = gameData;
  const openModal = () => {
    setAction({
      type: "edit",
      item: "gear",
      id,
      data,
    });
  };

  return (
    <TableCell align="center">
      <Tooltip
        title={isModalClosed() && (
          <Typography variant="body2">
            {data.info.set[0].id || data.info.setExtra.id ? "Edit" : "Add"} {INFO.SECTION_NAMES[2]}
          </Typography>
        )}
        arrow
      >
        <Stack justifyContent="center" alignItems="center">
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
                  src={setsIcons[`../assets/sets/${gameType}/${data.info.set[0].id}.webp`]?.default}
                  sx={{ width: 50, height: 50, objectFit: "contain" }}
                />
              )}
              {data.info.set[1].id && (
                <Box
                  component="img"
                  alt={data.info.set[1].id}
                  src={setsIcons[`../assets/sets/${gameType}/${data.info.set[1].id}.webp`]?.default}
                  sx={{ width: 50, height: 50, objectFit: "contain" }}
                />
              )}
              {data.info.setExtra.id && (
                <Box
                  component="img"
                  alt={data.info.setExtra.id}
                  src={setsIcons[`../assets/sets/${gameType}/${data.info.setExtra.id}.webp`]?.default}
                  sx={{ width: 50, height: 50, objectFit: "contain" }}
                />
              )}
            </Stack>
          ) : (
            <Add
              onClick={openModal}
              cursor="pointer"
            />
          )}
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default TableGear;
