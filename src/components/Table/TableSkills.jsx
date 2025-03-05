import React from "react";
import { Stack, Tooltip, Typography } from "@mui/material";

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
  );
};

export default TableSkills;
