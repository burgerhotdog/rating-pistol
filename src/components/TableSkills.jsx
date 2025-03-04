import React from "react";
import { TableCell, Tooltip, Typography } from "@mui/material";

const TableSkills = ({
  gameType,
  gameData,
  setAction,
  id,
  data,
  rating,
  isModalClosed,
}) => {
  const { INFO } = gameData;
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
        title={isModalClosed() && (
          <Typography variant="body2">
            Edit {INFO.SECTION_NAMES[3]}
          </Typography>
        )}
        arrow
      >
        <Typography
          onClick={openModal}
          variant="body1"
          sx={{ cursor: "pointer" }}
        >
          {rating.skills.toString() + "%"}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

export default TableSkills;
