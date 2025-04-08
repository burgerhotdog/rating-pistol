import React, { useMemo } from "react";
import { Tooltip, Badge, Avatar, Stack } from "@mui/material";
import Add from "@mui/icons-material/Add";
import SET_ASSETS from "@assets/set";
import getSetBonuses from "@utils/getSetBonuses";
import sortSetBonuses from "@utils/sortSetBonuses";

const Table3EquipList = ({ gameId, setPipe, id, data }) => {  
  const setBonuses = useMemo(() =>
    getSetBonuses(gameId, data.equipList),
    [gameId, data.equipList]
  );

  const sortedSetBonuses = useMemo(() =>
    sortSetBonuses(gameId, setBonuses),
    [gameId, setBonuses]
  );

  const openModal = () => setPipe({ type: "equip", id, data });

  if (!Object.keys(setBonuses).length) {
    return (
      <Tooltip title="Add" arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Edit" arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        {sortedSetBonuses.map(([setId, numBonus]) => (
          <Badge
            key={setId}
            badgeContent={<strong>x{numBonus}</strong>}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "rgba(20, 20, 20, 0.4)",
              },
            }}
          >
            <Avatar
              alt={setId}
              src={SET_ASSETS[`./${gameId}/${setId}.webp`]?.default}
            />
          </Badge>
        ))}
      </Stack>
    </Tooltip>
  );
};

export default Table3EquipList;
