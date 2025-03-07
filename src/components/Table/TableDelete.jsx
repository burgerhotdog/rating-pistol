import React from "react";
import { Stack } from "@mui/material";
import { Delete } from '@mui/icons-material';

const TableDelete = ({
  setAction,
  id,
  data,
  hoveredRowId,
}) => {
  const openModal = () => {
    setAction({
      type: "delete",
      id,
      data,
    });
  };

  return (
    <Stack alignItems="center">
      <Delete
        onClick={openModal}
        cursor="pointer"
        color="disabled"
        sx={{
          opacity: hoveredRowId === id ? 1 : 0,
          transition: "opacity 0.3s ease, color 0.3s ease",
          "&:hover": { color: "secondary.main" },
        }}
      />
    </Stack>
  );
};

export default TableDelete;
