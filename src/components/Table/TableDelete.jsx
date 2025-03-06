import React from "react";
import { Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

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
      <DeleteIcon
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
