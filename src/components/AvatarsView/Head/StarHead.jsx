import React from "react";
import { TableCell } from "@mui/material";
import { StarBorder } from "@mui/icons-material";

const StarHead = () => {
  return (
    <TableCell align="center" width={50}>
      <StarBorder color="disabled" />
    </TableCell>
  );
};

export default StarHead;
