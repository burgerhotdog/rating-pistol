import React from "react";
import { TableCell, Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const TableDelete = ({
  setAction,
  id,
  data,
  hoveredRow,
}) => {
  const openModal = () => {
    setAction({
      type: "delete",
      id,
      data,
    });
  };

  return (
    <TableCell sx={{ borderBottom: "none" }}>
      <Stack alignItems="center">
        <DeleteIcon
          onClick={openModal}
          cursor="pointer"
          color="disabled"
          sx={{
            opacity: hoveredRow === id ? 1 : 0,
            transition: "opacity 0.3s ease, color 0.3s ease",
            "&:hover": { color: "secondary.main" },
          }}
        />
      </Stack>
    </TableCell>
  );
};

export default TableDelete;
