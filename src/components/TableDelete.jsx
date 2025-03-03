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
      {hoveredRow === id && 
        <DeleteIcon
          onClick={openModal}
          color="error"
          sx={{ cursor: "pointer" }}
        />
      }
    </TableCell>
  );
};

export default TableDelete;
