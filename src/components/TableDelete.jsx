import React from "react";
import TableCell from "@mui/material/TableCell";
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
    <TableCell align="center" sx={{ borderBottom: "none" }}>
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
    </TableCell>
  );
};

export default TableDelete;
