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
  const { SETS } = gameData;
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
      {(data?.info?.set[0] || data?.info?.setExtra) ? (
        <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
          {data.info.set[0] && (
            <Tooltip
              title={isModalClosed() && (
                <Stack>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {SETS[data.info.set[0]].name}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {SETS[data.info.set[0]].desc}
                  </Typography>
                </Stack>
              )}
              arrow
            >
              <Box
                component="img"
                alt={data.info.set[0]}
                onClick={openModal}
                src={setsIcons[`../assets/sets/${gameType}/${data.info.set[0]}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
              />
            </Tooltip>
          )}
          {data.info.set[0] && data.info.setExtra && (
            <Typography>+</Typography>
          )}
          {data.info.setExtra && (
            <Tooltip
              title={isModalClosed() && (
                <Stack>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {SETS[data.info.setExtra].name}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {SETS[data.info.setExtra].desc}
                  </Typography>
                </Stack>
              )}
              arrow
            >
              <Box
                component="img"
                alt={data.info.setExtra}
                onClick={openModal}
                src={setsIcons[`../assets/sets/${gameType}/${data.info.setExtra}.webp`]?.default}
                sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
              />
            </Tooltip>
          )}
        </Stack>
      ) : (
        <Tooltip>
          <Add
            onClick={openModal}
            cursor="pointer"
          />
        </Tooltip>
      )}
    </TableCell>
  );
};

export default TableGear;
