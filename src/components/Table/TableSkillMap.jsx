import React from "react";
import { Stack, Tooltip, Typography } from "@mui/material";
import getData from "../getData";

const TableSkillMap = ({
  gameId,
  setAction,
  id,
  data,
  rating,
}) => {
  const { generalData } = getData(gameId);
  const openModal = () => {
    setAction({
      type: "edit",
      item: "skillMap",
      id,
      data,
    });
  };

  const sectionName = generalData.SECTION_NAMES[3];

  return (
    <Stack alignItems="center">
      <Tooltip title={`Edit ${sectionName}`} arrow>
        <Typography
          onClick={openModal}
          variant="body1"
          sx={{ cursor: "pointer" }}
        >
          {`${rating.skillMap.toString()}%`}
        </Typography>
      </Tooltip>
    </Stack>
  );
};

export default TableSkillMap;
