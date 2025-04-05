import React, { useState } from "react";
import { Box, Stack, Paper } from "@mui/material";
import { ASSETS, DATA } from "../../../../importData";
import Node from "./Node";
import getNodeIcon from "./getNodeIcon";
import configs from "./configs";

const HSR = ({ avatarId, rank, skillMap, editSkillMap }) => {
  const { SKILL_CAPS, AVATAR_DATA } = DATA.hsr;
  const { PATH_IMGS } = ASSETS.hsr;
  const { type } = AVATAR_DATA[avatarId];
  const NODES = configs[type];
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
    if (id === "007") return; // technique
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
        <Box sx={{ width: 600, height: 600, userSelect: "none" }}>
          <svg width="100%" height="100%" viewBox="0 0 600 600">
            {/* Background Image */}
            <image
              href={PATH_IMGS[`./${type.replace(/ /g, "_")}.webp`]?.default}
              x="108"
              y="108"
              width="384"
              height="384"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.1"
            />

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

                const imageSrc = getNodeIcon(avatarId, id);
                const isPassive = id === "007";

                const rankTraceIndex = Number(id.slice(1)) - 1;
                const rankReq = AVATAR_DATA[avatarId].rankTrace[rankTraceIndex];
                const rankBonus = rankReq && rank >= rankReq
                  ? ["001", "005", "006"].includes(id) ? 1 : 2
                  : 0;
                
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
                    rankBonus={rankBonus}
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

export default HSR;
