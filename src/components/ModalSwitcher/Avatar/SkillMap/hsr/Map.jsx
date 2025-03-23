import React from "react";
import { Box, Paper } from "@mui/material";
import getData from "../../../../getData";
import Node from "./Node";
import getNodeIcon from "./getNodeIcon";
import configs from "./configs";

const HSR = ({
  modalPipe,
  editSkillMap,
}) => {
  const { SKILL_CAPS, AVATAR_DATA } = getData.hsr;
  const { skillMap } = modalPipe.data;
  const NODES = configs[AVATAR_DATA[modalPipe.id].type];

  const handleSkill = (id) => {
    const value = skillMap[id];
    const newValue = value < SKILL_CAPS[Number(id[2]) - 1] ? value + 1 : 1;
    editSkillMap(id, newValue);
  };

  const deactivateChildren = (id) => {
    const { children } = NODES[id];
    if (children) {
      children.forEach((childId) => {
        if (childId !== "000") editSkillMap(childId, 0);
        deactivateChildren(childId);
      });
    }
  };

  const handleNonSkill = (id) => {
    const value = skillMap[id];
    const newValue = value ? 0 : 1;
    editSkillMap(id, newValue);

    // If turning off, deactivate all children
    if (!newValue) deactivateChildren(id);
  };

  const handleNode = (id) => {
    if (id[0] !== "0") {
      handleNonSkill(id);
    } else if (id !== "007") {
      handleSkill(id);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ position: "relative", width: "100%", height: "550px" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 600">
          {/* Render lines */}
          {Object.entries(NODES)
            .filter(([_, config]) => config.parent)
            .map(([id, config], index) => (
              <line
                key={index}
                x1={NODES[id].x}
                y1={NODES[id].y}
                x2={NODES[config.parent].x}
                y2={NODES[config.parent].y}
                stroke="white"
              />
            ))}

          {/* Render nodes */}
          {Object.entries(NODES)
            .filter(([id]) => Number(id))
            .map(([id, { x, y, parent }], index) => {
              const realParent = parent === "000" ? NODES[parent].parent : parent;
              const parentIsActive = Boolean(skillMap[realParent]);

              const imageSrc = getNodeIcon(modalPipe.id, id);

              const rankTraceIndex = Number(id.slice(1)) - 1;
              const rankReq = AVATAR_DATA[modalPipe.id].rankTrace[rankTraceIndex];
              const rankBonus = rankReq && modalPipe.data.rank >= rankReq
                ? ["001", "005", "006"].includes(id) ? 1 : 2
                : 0;
              
              return (
                <Node
                  key={index}
                  x={x}
                  y={y}
                  id={id}
                  value={skillMap[id]}
                  maxValue={id[0] === "0" ? SKILL_CAPS[Number(id[2]) - 1] : 1}
                  onClick={handleNode}
                  imageSrc={imageSrc}
                  active={skillMap[id] !== 0}
                  locked={id[0] !== "0" && !parentIsActive}
                  rankBonus={rankBonus}
                />
              )
            })}
        </svg>
      </Box>
    </Paper>
  );
};

export default HSR;
