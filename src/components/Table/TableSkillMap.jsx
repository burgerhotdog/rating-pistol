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

  return (
    <Stack alignItems="center">
      <Tooltip title={`Edit ${generalData.SECTIONS[3]}`} arrow>
        <Typography
          onClick={openModal}
          variant="body1"
          sx={{ cursor: "pointer" }}
        >
          {`${String(rating.parts[3])}%`}
        </Typography>
      </Tooltip>
    </Stack>
  );
};

export default TableSkillMap;
