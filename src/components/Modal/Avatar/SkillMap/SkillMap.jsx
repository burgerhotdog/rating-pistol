import { useState } from "react";
import { Box, Stack, Paper } from "@mui/material";
import { PATH_ASSETS } from "@assets";
import { AVATAR_DATA, INFO_DATA } from "@data";
import Node from "./Node";
import nodeMaps from "./nodeMaps";
import getNodeIcon from "./getNodeIcon";
import getRankBonus from "./getRankBonus";

const MAP_SIZE = {
  gi: { width: 200, height: 300 },
  hsr: { width: 600, height: 600 },
  ww: { width: 600, height: 400 },
  zzz: { width: 600, height: 300 },
};

const SkillMap = ({ gameId, id, rank, skillMap, setSkillMap }) => {
  const { SKILL_MAX_LEVEL } = INFO_DATA[gameId];
  const pathSrc = AVATAR_DATA[gameId][id].type.replace(/ /g, "_");
  const NODES = gameId === "hsr" ? nodeMaps[gameId][pathSrc] : nodeMaps[gameId];
  const [hoveredNode, setHoveredNode] = useState(null);

  const handleSkillMap = (skill, newValue) =>
    setSkillMap((prev) => ({
      ...prev,
      [skill]: newValue,
    }));

  const deactivateChildren = (node) => {
    const { children } = NODES[node];
    if (children) {
      children.forEach((child) => {
        if (child !== "000") handleSkillMap(child, 0);
        deactivateChildren(child);
      });
    }
  };

  const activateParents = (node) => {
    const { parent } = NODES[node];
    if (parent && !skillMap[parent]) {
      if (parent !== "000") handleSkillMap(parent, 1);
      activateParents(parent);
    }
  };

  const handleNode = (node) => {
    if (node === "007") return;

    if (node[0] === "0") {
      if (skillMap[node] < SKILL_MAX_LEVEL[node]) {
        handleSkillMap(node, skillMap[node] + 1);
        return;
      }
      handleSkillMap(node, 1);
      return;
    }

    const newValue = skillMap[node] ? 0 : 1;
    handleSkillMap(node, newValue);
    if (!newValue) deactivateChildren(node);
    else activateParents(node);
  };

  const viewBox = `0 0 ${MAP_SIZE[gameId].width} ${MAP_SIZE[gameId].height}`;

  return (
    <Stack direction="row" spacing={2}>
      <Paper sx={{ p: 1, borderRadius: 2 }}>
        <Box sx={{ ...MAP_SIZE[gameId], userSelect: "none" }}>
          <svg width="100%" height="100%" viewBox={viewBox}>
            {/* Background Image */}
            {gameId === "hsr" && (
              <image
                href={PATH_ASSETS[pathSrc]}
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
              .filter(([_, { parent }]) => parent)
              .map(([node, { parent }], index) => (
                <line
                  key={index}
                  x1={NODES[node].x}
                  y1={NODES[node].y}
                  x2={NODES[parent].x}
                  y2={NODES[parent].y}
                  stroke="white"
                />
              ))}

            {/* Render nodes */}
            {Object.entries(NODES)
              .filter(([node]) => Number(node))
              .map(([node, { x, y, parent }]) => {
                const realParent = parent === "000"
                  ? NODES[parent].parent
                  : parent;
                const parentInactive = skillMap[realParent] === 0;
                
                return (
                  <Node
                    key={node}
                    gameId={gameId}
                    x={x}
                    y={y}
                    id={node}
                    value={skillMap[node] ?? 1}
                    maxValue={(node[0] === "0" && skillMap[node]) ? SKILL_MAX_LEVEL[node] : 1}
                    onClick={handleNode}
                    imageSrc={getNodeIcon(gameId, id, node)}
                    active={skillMap[node] !== 0}
                    locked={node[0] !== "0" && parentInactive}
                    rankBonus={getRankBonus(gameId, id, rank, node)}
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

export default SkillMap;
