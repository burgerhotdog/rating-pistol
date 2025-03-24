import React, { useState } from "react";
import { Box, Stack, Paper } from "@mui/material";
import getData from "../../../../getData";
import getImgs from "../../../../getImgs";
import Node from "./Node";
import getNodeIcon from "./getNodeIcon";
import configs from "./configs";
import DisplayInfo from "./DisplayInfo";

const HSR = ({ modalPipe, editSkillMap }) => {
  const { SKILL_CAPS, AVATAR_DATA } = getData.hsr;
  const { PATH_IMGS } = getImgs.hsr;
  const { skillMap } = modalPipe.data;
  const avatarType = AVATAR_DATA[modalPipe.id].type;
  const NODES = configs[avatarType];
  const pathSrc = PATH_IMGS[`./${avatarType.replace(/ /g, "_")}.webp`]?.default
  const [hoveredNode, setHoveredNode] = useState(null);

  const deactivateChildren = (id) => {
    const { children } = NODES[id];
    if (children) {
      children.forEach((childId) => {
        if (childId !== "000") editSkillMap(childId, 0);
        deactivateChildren(childId);
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
        <Box sx={{ width: 600, height: 600 }}>
          <svg width="100%" height="100%" viewBox="0 0 600 600">
            {/* Background Image */}
            <image
              href={pathSrc}
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
                const realParent = parent === "000" ? NODES[parent].parent : parent;
                const parentInactive = !Boolean(skillMap[realParent]);

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
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ width: 250, height: 600 }}>
          {hoveredNode && (
            <DisplayInfo id={hoveredNode} avatarId={modalPipe.id} />
          )}
        </Box>
      </Paper>
    </Stack>
  );
};

export default HSR;
