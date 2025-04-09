import React from "react";
import TableCell from "@mui/material/TableCell";
import StarBorder from "@mui/icons-material/StarBorder";

const StarHead = () => {
  return (
    <TableCell align="center" width={50}>
      <StarBorder
        cursor="pointer"
        color="disabled"
      />
    </TableCell>
  );
};

export default StarHead;
