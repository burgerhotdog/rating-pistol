import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TableRating = ({
  setAction,
  id,
  data,
  rating,
  isModalClosed,
}) => {
  const openModal = () => {
    setAction({
      type: "rating",
      id,
      data,
      rating,
    });
  };

  return (
    <TableCell align="center">
      {rating.final !== -1 ? (
        <Tooltip
          title={isModalClosed && (
            <Typography variant="body2">
              See details
            </Typography>
          )}
          arrow
        >
          <Typography onClick={openModal} sx={{ cursor: "pointer" }}>
            {rating.final.toString()}
          </Typography>
        </Tooltip>
      ) : (
        <Tooltip
          title={isModalClosed && (
            <Typography variant="body2">
              No weapon selected
            </Typography>
          )}
          arrow
        >
          <ErrorOutline
            color="error"
            cursor="pointer"
          />
        </Tooltip>
      )}
    </TableCell>
  );
};

export default TableRating;
