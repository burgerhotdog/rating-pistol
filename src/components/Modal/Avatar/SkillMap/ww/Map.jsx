import React, { useState } from "react";
import { Stack, Paper, Box } from "@mui/material";
import { DATA } from "../../../../importData";
import Node from "./Node";
import getNodeIcon from "./getNodeIcon";
import config from "./config";

const WW = ({ avatarId, skillMap, editSkillMap }) => {
  const { SKILL_CAPS } = DATA.ww;
  const NODES = config;
  const [hoveredNode, setHoveredNode] = useState(null);

  const deactivateChildren = (id) => {
    const { children } = NODES[id];
    if (children) {
      children.forEach((child) => {
        if (child !== "000") editSkillMap(child, 0);
        deactivateChildren(child);
      });
    }
  };

  const activateParents = (id) => {
    const { parent } = NODES[id];
    if (parent && !skillMap[parent]) {
      if (parent !== "000") editSkillMap(parent, 1);
      activateParents(parent);
    }
  };

  const handleNode = (id) => {
    if (id === "007") return; // outro
    const value = skillMap[id];
    if (id[0] === "0") {
      const newValue = value < SKILL_CAPS[Number(id[2]) - 1] ? value + 1 : 1;
      editSkillMap(id, newValue);
    } else {
      const newValue = value ? 0 : 1;
      editSkillMap(id, newValue);
      if (!newValue) deactivateChildren(id);
      else activateParents(id);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ width: 600, height: 400, userSelect: "none" }}>
          <svg width="100%" height="100%" viewBox="0 0 600 400">
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
                const realParent = parent === "000"
                  ? NODES[parent].parent
                  : parent;
                const parentInactive = !Boolean(skillMap[realParent]);
                const isPassive = id === "007";
                const imageSrc = getNodeIcon(avatarId, id);                
                
                return (
                  <Node
                    key={index}
                    x={x}
                    y={y}
                    id={id}
                    value={isPassive ? 1 : skillMap[id]}
                    maxValue={isPassive ? 1 : id[0] === "0" ? SKILL_CAPS[Number(id[2]) - 1] : 1}
                    onClick={handleNode}
                    imageSrc={imageSrc}
                    active={skillMap[id] !== 0}
                    locked={id[0] !== "0" && parentInactive}
                    hoveredNode={hoveredNode}
                    setHoveredNode={setHoveredNode}
                  />
                )
              })}
          </svg>
        </Box>
      </Paper>
    </Stack>
  );
};

export default WW;
