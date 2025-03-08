import React, { useState } from "react";
import {
  Modal,
  Box,
  Stack,
  Button,
  Typography,
  useTheme
} from "@mui/material";
import getData from "../../getData";

const RatingModal = ({
  gameId,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { generalData } = getData(gameId);

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "rating"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack spacing={2}>
          <Typography variant="body1">
            Score Breakdown
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTION_NAMES[0]} Score: ${action?.rating?.avatar}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTION_NAMES[1]} Score: ${action?.rating?.weapon}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTION_NAMES[2]} Score: ${action?.rating?.equipList}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTION_NAMES[3]} Score: ${action?.rating?.skillMap}`}
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RatingModal;
