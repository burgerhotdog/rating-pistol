import React from "react";
import { Delete } from '@mui/icons-material';

const Table5Delete = ({
  setAction,
  id,
  data,
  hoveredId,
}) => {
  const openModal = () => {
    setAction({
      type: "delete",
      id,
      data,
    });
  };

  return (
    <Delete
      onClick={openModal}
      cursor="pointer"
      color="disabled"
      sx={{
        opacity: hoveredId === id ? 1 : 0,
        transition: "opacity 0.3s ease, color 0.3s ease",
        "&:hover": { color: "secondary.main" },
      }}
    />
  );
};

export default Table5Delete;
