import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";

const TableSkills = ({
  gameType,
  setAction,
  id,
  data,
  rating,
  isModalClosed,
}) => {
  const openModal = () => {
    setAction({
      type: "edit",
      item: "skills",
      id,
      data,
    });
  };

  return (
    <TableCell align="center">
      <Tooltip
        arrow
      >
        <Typography
          onClick={openModal}
          sx={{ cursor: "pointer" }}
        >
          {rating.skills.toString() + "%"}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

export default TableSkills;
