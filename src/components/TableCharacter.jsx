import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TableCharacter = ({
  gameType,
  CHAR,
  charIcons,
  setAction,
  id,
  data,
}) => {
  const openModal = () => {
    setAction({
      type: "edit",
      item: "character",
      id,
      data,
    });
  };

  return (
    <TableCell align="center">
      <Tooltip
        arrow
      >
        <Stack
          onClick={openModal}
          direction="row"
          alignItems="center"
          gap={2}
          sx={{ cursor: "pointer" }}
        >
          <Box
            component="img"
            alt={id}
            src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
            sx={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <Typography variant="body2" sx={{ textAlign: "left" }}>
            {CHAR[id].name}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default TableCharacter;
