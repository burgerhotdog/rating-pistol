import React from "react";
import { Box, Paper } from "@mui/material";
import Node from "./Node";
import Path from "./Path";
import nihility from "./configs/nihility";
const pathConfigs = { nihility };

const HSR = ({
  modalPipe,
  editSkillMap,
}) => {
  const { skillMap } = modalPipe.data;
  const NODES = pathConfigs["nihility"]; // hardcoded for now
  const centerX = 300;
  const centerY = 200;

  const handleSkill = (skill) => {
    const currentLevel = Number(skillMap[skill] || "0");
    const maxLevel = skill === "basic" ? 6 : 10;
    const nextLevel = currentLevel < maxLevel
      ? currentLevel + 1
      : 1;
    editSkillMap(skill, String(nextLevel));
  };

  const deactivateChildren = (id) => {
    const { children } = NODES[id];
    if (children) {
      children.forEach((childId) => {
        editSkillMap(childId, "0"); // Set child to "0"
        deactivateChildren(childId); // Recursively process its children
      });
    }
  };

  const handleNodeClick = (id) => {
    const currentValue = skillMap[id] === "1";
    const newValue = currentValue ? "0" : "1";
    editSkillMap(id, newValue);

    // If turning off, recursively deactivate all descendants
    if (newValue === "0") {
      deactivateChildren(id);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ position: "relative", width: "100%", height: "450px" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 400">
          {Object.entries(NODES)
            .reduce((next, [id, config]) => {
              if (config.parent) {
                next.push([id, config]);
              }
              return next;
            }, [])
            .map(([id, config], index) => {
              const { parent } = config;
              return (
                <Path
                  key={index}
                  x1={centerX + NODES[id].xOffset}
                  y1={centerY + NODES[id].yOffset}
                  x2={centerX + NODES[parent].xOffset}
                  y2={centerY + NODES[parent].yOffset}
                  active
                />
              );
            })}

          {Object.entries(NODES).map(([id, config], index) => {
            const { xOffset, yOffset, type, parent } = config;
            const parentActive = skillMap[parent] === "1";
            const locked = type === "minor" && !parentActive;
            return (
              <Node
                key={index}
                x={centerX + xOffset}
                y={centerY + yOffset}
                type={type}
                value={type === "skill" ? skillMap[id] : null}
                onClick={() => {
                  if (type === "skill") {
                    handleSkill(id);
                  } else {
                    handleNodeClick(id);
                  }
                }}
                label={id}
                active={type === "skill" ? true : skillMap[id] === "1"}
                locked={locked}
              />
            )
          })}
        </svg>
      </Box>
    </Paper>
  );
};

export default HSR;
