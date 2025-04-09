import React from "react";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import StarBorder from "@mui/icons-material/StarBorder";

const StarHead = () => {
  return (
    <TableCell align="center" width={50}>
      <StarBorder color="disabled" />
    </TableCell>
  );
};

export default StarHead;
