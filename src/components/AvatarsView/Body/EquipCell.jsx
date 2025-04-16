import React, { useMemo } from "react";
import { Tooltip, Badge, Avatar, Stack, TableCell } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { SET_ASSETS } from "@assets";
import { LABELS } from "@data";
import getSetBonuses from "@utils/getSetBonuses";

const EquipCell = ({ gameId, setPipe, id, data }) => {  
  const setBonuses = useMemo(() =>
    getSetBonuses(gameId, data.equipList),
    [gameId, data.equipList]
  );

  const openModal = () => setPipe({ type: "equip", id, data });

  if (!Object.keys(setBonuses).length) {
    return (
      <TableCell align="center">
        <Tooltip title={`Add ${LABELS[gameId].Equips}`} arrow>
          <Add onClick={openModal} cursor="pointer" />
        </Tooltip>
      </TableCell>
    );
  }

  return (
    <TableCell align="center">
      <Tooltip title={`Edit ${LABELS[gameId].Equips}`} arrow>
        <Stack
          onClick={openModal}
          display="inline-flex"
          direction="row"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          {setBonuses.map(([setId, numBonus]) => (
            <Badge
              key={setId}
              badgeContent={`x${numBonus}`}
            >
              <Avatar
                alt={setId}
                src={SET_ASSETS[`./${gameId}/${setId}.webp`]?.default}
              />
            </Badge>
          ))}
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default EquipCell;
