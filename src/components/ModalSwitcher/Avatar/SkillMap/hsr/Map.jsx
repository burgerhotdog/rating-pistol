import React from "react";
import { Box, Paper } from "@mui/material";
import getData from "../../../../getData";
import Node from "./Node";
import getNodeLabel from "./getNodeLabel";
import configs from "./configs";

const HSR = ({
  modalPipe,
  editSkillMap,
}) => {
  const { SKILL_CAPS } = getData.hsr;
  const { skillMap } = modalPipe.data;
  const NODES = configs["nihility"]; // hardcoded for now
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

  const handleMajorMinor = (id) => {
    const currentValue = skillMap[id] === "1";
    const newValue = currentValue ? "0" : "1";
    editSkillMap(id, newValue);

    // If turning off, recursively deactivate all descendants
    if (newValue === "0") {
      deactivateChildren(id);
    }
  };

  const handleNode = (id, type) => {
    if (type !== "skill") {
      handleMajorMinor(id);
    } else if (id !== "tech") {
      handleSkill(id);
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
                <line
                  key={index}
                  x1={centerX + NODES[id].offsetX}
                  y1={centerY + NODES[id].offsetY}
                  x2={centerX + NODES[parent].offsetX}
                  y2={centerY + NODES[parent].offsetY}
                  stroke="white"
                />
              );
            })}

          {Object.entries(NODES).map(([id, config], index) => {
            const { offsetX, offsetY, type, parent } = config;
            const parentActive = skillMap[parent] !== "0";
            const label = getNodeLabel(modalPipe.id, id);
            return (
              <Node
                key={index}
                x={centerX + offsetX}
                y={centerY + offsetY}
                type={type}
                id={id}
                value={skillMap[id]}
                onClick={handleNode}
                label={label}
                active={skillMap[id] !== "0"}
                capped={Number(skillMap[id]) === SKILL_CAPS[id]}
                locked={!parentActive}
              />
            )
          })}
        </svg>
      </Box>
    </Paper>
  );
};

export default HSR;
