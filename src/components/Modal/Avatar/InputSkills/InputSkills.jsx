import React, { useState } from "react";
import { Box, Stack, Paper } from "@mui/material";
import { PATH_ASSETS } from "@assets";
import { INFO, AVATARS } from "@data";
import Node from "./Node";
import getNodeIcon from "./getNodeIcon";
import configs from "./configs";
import getRankBonus from "./getRankBonus";

const InputSkills = ({ gameId, pipe, setPipe }) => {
  const config = configs[gameId];
  const avatarId = pipe.id;
  const rank = pipe.data.rank;
  const skillMap = pipe.data.skillMap;
  const SKILL_MAX_LEVEL = INFO[gameId].SKILL_MAX_LEVEL;
  const type = AVATARS[gameId][avatarId].type;
  const NODES = gameId === "hsr"
    ? config.nodes[type]
    : config.nodes;
  const [hoveredNode, setHoveredNode] = useState(null);

  const editSkillMap = (skill, newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skillMap: {
          ...prev.data.skillMap,
          [skill]: newValue,
        },
      },
    }));
  };

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
    if (id === "007") return;
    const value = skillMap[id];
    if (id[0] === "0") {
      const newValue = value < SKILL_MAX_LEVEL[Number(id[2]) - 1] ? value + 1 : 1;
      editSkillMap(id, newValue);
    } else {
      const newValue = value ? 0 : 1;
      editSkillMap(id, newValue);
      if (!newValue) deactivateChildren(id);
      else activateParents(id);
    }
  };

  const viewBox = `0 0 ${config.width} ${config.height}`;

  return (
    <Stack direction="row" spacing={2}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ width: config.width, height: config.height, userSelect: "none" }}>
          <svg width="100%" height="100%" viewBox={viewBox}>
            {/* Background Image */}
            {gameId === "hsr" && (
              <image
                href={PATH_ASSETS[`./${type.replace(/ /g, "_")}.webp`]?.default}
                x="108"
                y="108"
                width="384"
                height="384"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.1"
              />
            )}

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
                const parentInactive = skillMap[realParent] === 0;
                const isPassive = id === "007";
                const imageSrc = getNodeIcon(gameId, avatarId, id);
                const rankBonus = getRankBonus(gameId, avatarId, rank, id);
                
                return (
                  <Node
                    key={index}
                    x={x}
                    y={y}
                    id={id}
                    value={isPassive ? 1 : skillMap[id]}
                    maxValue={isPassive ? 1 : id[0] === "0" ? SKILL_MAX_LEVEL[Number(id[2]) - 1] : 1}
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

export default InputSkills;
