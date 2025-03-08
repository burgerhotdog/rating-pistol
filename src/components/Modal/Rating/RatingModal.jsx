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
            {`${generalData.SECTIONS[0]} Score: ${action?.rating?.parts[0]}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTIONS[1]} Score: ${action?.rating?.parts[1]}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTIONS[2]} Score: ${action?.rating?.parts[2]}`}
          </Typography>
          <Typography variant="body2">
            {`${generalData.SECTIONS[3]} Score: ${action?.rating?.parts[3]}`}
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RatingModal;
