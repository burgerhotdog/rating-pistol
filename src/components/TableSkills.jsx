import React from "react";
import { TableCell, Stack, Tooltip, Typography } from "@mui/material";

const TableSkills = ({
  gameType,
  gameData,
  setAction,
  id,
  data,
  rating,
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

  const addOrEdit = "Edit";
  const sectionName = INFO.SECTION_NAMES[3];

  return (
    <TableCell>
      <Stack alignItems="center">
        <Tooltip title={`${addOrEdit} ${sectionName}`} arrow>
          <Typography
            onClick={openModal}
            variant="body1"
            sx={{ cursor: "pointer" }}
          >
            {`${rating.skills.toString()}%`}
          </Typography>
        </Tooltip>
      </Stack>
    </TableCell>
  );
};

export default TableSkills;
