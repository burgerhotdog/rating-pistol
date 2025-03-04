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
            {data.info.set[0] || data.info.setExtra ? "Edit" : "Add"} {INFO.SECTION_NAMES[2]}
          </Typography>
        )}
        arrow
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          {data.info.set[0] || data.info.setExtra ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              {data.info.set[0] && (
                <Box
                  component="img"
                  alt={data.info.set[0]}
                  onClick={openModal}
                  src={setsIcons[`../assets/sets/${gameType}/${data.info.set[0]}.webp`]?.default}
                  sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                />
              )}
              {data.info.setExtra && (
                <Box
                  component="img"
                  alt={data.info.setExtra}
                  onClick={openModal}
                  src={setsIcons[`../assets/sets/${gameType}/${data.info.setExtra}.webp`]?.default}
                  sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
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
