import React from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import { SkillNode, MajorNode, MinorNode } from "./Node";
import Path from "./Path";

const HSR = ({
  modalPipe,
  handleSkill,
}) => {
  const { skillMap } = modalPipe.data;

  // Define trace connections and positions
  const centerX = 300;
  const centerY = 200;
  const mainRadius = 120;
  const statRadius = 70;
  
  // Main trace positions
  const mainTraces = {
    basic: { angle: -180, label: "Basic ATK" },
    skill: { angle: 0, label: "Skill" },
    ult: { angle: 40, label: "Ultimate" },
    talent: { angle: -90, label: "Talent" },
  };
  
  // Stat traces connected to main traces
  const statTraces = {
    // Basic stat nodes
    basicHp: { parent: "basic", angle: -150, label: "HP" },
    basicDef: { parent: "basic", angle: -90, label: "DEF" },
    
    // Skill stat nodes
    skillAtk: { parent: "skill", angle: -70, label: "ATK" },
    skillSpd: { parent: "skill", angle: -10, label: "SPD" },
    
    // Ultimate stat nodes
    ultAtk: { parent: "ult", angle: 10, label: "ATK" },
    ultSpd: { parent: "ult", angle: 70, label: "SPD" },
    
    // Talent stat nodes
    talentHp: { parent: "talent", angle: 90, label: "HP" },
    talentDef: { parent: "talent", angle: 150, label: "DEF" },
  };
  
  // Calculate positions based on angles and radius
  const calculatePosition = (centerX, centerY, angle, radius) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  // Calculate positions for main traces
  Object.keys(mainTraces).forEach(trace => {
    const { angle } = mainTraces[trace];
    const { x, y } = calculatePosition(centerX, centerY, angle, mainRadius);
    mainTraces[trace].x = x;
    mainTraces[trace].y = y;
  });
  
  // Calculate positions for stat traces
  Object.keys(statTraces).forEach(trace => {
    const { parent, angle } = statTraces[trace];
    const parentX = mainTraces[parent].x;
    const parentY = mainTraces[parent].y;
    const { x, y } = calculatePosition(parentX, parentY, angle, statRadius);
    statTraces[trace].x = x;
    statTraces[trace].y = y;
    
    // Store parent coordinates for path drawing
    statTraces[trace].parentX = parentX;
    statTraces[trace].parentY = parentY;
  });

  // Check if a main trace is active
  const isMainTraceActive = (traceName) => {
    return !!skillMap[traceName];
  };
  
  // Check if a stat trace is active and not locked
  const isStatTraceActive = (traceName) => {
    return !!skillMap[traceName] && !isStatTraceLocked(traceName);
  };
  
  // Check if a stat trace is locked (parent node must be active)
  const isStatTraceLocked = (traceName) => {
    const parentName = statTraces[traceName].parent;
    return !isMainTraceActive(parentName);
  };

  // Handle main node click
  const handleMainNodeClick = (traceName) => {
    // Get current level
    const currentLevel = parseInt(skillMap[traceName] || '0');
    
    // Get max level based on trace type
    const maxLevel = traceName === 'basic' ? 6 : 10;
    
    // Calculate next level (cycle through 1 to maxLevel)
    const nextLevel = currentLevel < maxLevel ? currentLevel + 1 : 1;
    
    // Create a synthetic event object to work with your existing handler
    const syntheticEvent = {
      target: {
        name: traceName,
        value: nextLevel.toString()
      }
    };
    
    handleSkill(syntheticEvent);
  };
  
  // Handle stat node click
  const handleStatNodeClick = (traceName) => {
    // Check if parent is active
    const parentName = statTraces[traceName].parent;
    if (!isMainTraceActive(parentName)) {
      return; // Cannot activate stat if parent is not active
    }
    
    // Get current level
    const currentLevel = parseInt(skillMap[traceName] || '0');
    
    // Max level for stat nodes is 3
    const maxLevel = 1;
    
    // Calculate next level (cycle through 1 to maxLevel)
    const nextLevel = currentLevel < maxLevel ? currentLevel + 1 : 1;
    
    // Create a synthetic event object
    const syntheticEvent = {
      target: {
        name: traceName,
        value: nextLevel.toString()
      }
    };
    
    handleSkill(syntheticEvent);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ position: "relative", width: "100%", height: "450px" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 400">
          {/* Skill Paths */}
          <Path
            startX={centerX}
            startY={centerY}
            endX={centerX - 60}
            endY={centerY + 5}
            active
          />
          <Path
            startX={centerX}
            startY={centerY}
            endX={centerX + 60}
            endY={centerY + 5}
            active
          />
          <Path
            startX={centerX}
            startY={centerY}
            endX={centerX + 0}
            endY={centerY - 50}
            active
          />
          <Path
            startX={centerX}
            startY={centerY}
            endX={centerX + 0}
            endY={centerY + 50}
            active
          />

          {/* Major Paths */}
          <Path
            startX={centerX - 60}
            startY={centerY + 5}
            endX={centerX - 60 - 50}
            endY={centerY + 5 - 25}
            active
          />
          <Path
            startX={centerX + 60}
            startY={centerY + 5}
            endX={centerX + 60 + 50}
            endY={centerY + 5 - 25}
            active
          />
          <Path
            startX={centerX + 0}
            startY={centerY - 50}
            endX={centerX + 0 + 0}
            endY={centerY - 50 - 50}
            active
          />

          {/* Minor Paths */}
          <Path
            startX={centerX - 60 - 50}
            startY={centerY + 5 - 25}
            endX={centerX - 60 - 50 - 50}
            endY={centerY + 5 - 25 + 40}
            active
          />
          <Path
            startX={centerX - 60 - 50 - 50}
            startY={centerY + 5 - 25 + 40}
            endX={centerX - 60 - 50 - 50 + 30}
            endY={centerY + 5 - 25 + 40 + 40}
            active
          />
          <Path
            startX={centerX - 60 - 50 - 50 + 30}
            startY={centerY + 5 - 25 + 40 + 40}
            endX={centerX - 60 - 50 - 50 + 30 + 30}
            endY={centerY + 5 - 25 + 40 + 40 + 40}
            active
          />
          
          <Path
            startX={centerX + 60 + 50}
            startY={centerY + 5 - 25}
            endX={centerX + 60 + 50 + 50}
            endY={centerY + 5 - 25 + 40}
            active
          />
          <Path
            startX={centerX + 60 + 50 + 50}
            startY={centerY + 5 - 25 + 40}
            endX={centerX + 60 + 50 + 50 - 30}
            endY={centerY + 5 - 25 + 40 + 40}
            active
          />
          <Path
            startX={centerX + 60 + 50 + 50 - 30}
            startY={centerY + 5 - 25 + 40 + 40}
            endX={centerX + 60 + 50 + 50 - 30 - 30}
            endY={centerY + 5 - 25 + 40 + 40 + 40}
            active
          />
          
          <Path
            startX={centerX + 0 + 0}
            startY={centerY - 50 - 50}
            endX={centerX + 0 + 0 + 65}
            endY={centerY - 50 - 50 + 5}
            active
          />
          <Path
            startX={centerX + 0 + 0}
            startY={centerY - 50 - 50}
            endX={centerX + 0 + 0 - 65}
            endY={centerY - 50 - 50 + 5}
            active
          />

          <Path
            startX={centerX + 0}
            startY={centerY + 50}
            endX={centerX + 0 + 0}
            endY={centerY + 50 + 40}
            active
          />
          <Path
            startX={centerX + 0 + 0}
            startY={centerY + 50 + 40}
            endX={centerX + 0 + 0 + 0}
            endY={centerY + 50 + 40 + 40}
            active
          />

          {/* Skill Nodes */}
          <SkillNode
            x={centerX - 60}
            y={centerY + 5}
            value={skillMap.basic}
            onClick={() => handleMainNodeClick("basic")}
            label={"basic"}
          />
          <SkillNode
            x={centerX + 60}
            y={centerY + 5}
            value={skillMap.skill}
            onClick={() => handleMainNodeClick("skill")}
            label={"skill"}
          />
          <SkillNode
            x={centerX}
            y={centerY}
            value={skillMap.ult}
            onClick={() => handleMainNodeClick("ult")}
            label={"ult"}
          />
          <SkillNode
            x={centerX + 0}
            y={centerY - 50}
            value={skillMap.talent}
            onClick={() => handleMainNodeClick("talent")}
            label={"talent"}
          />
          <SkillNode
            x={centerX + 0}
            y={centerY + 50}
            value={1}
            label={"tech"}
          />

          {/* Major Nodes */}
          <MajorNode
            x={centerX - 60 - 50}
            y={centerY + 5 - 25}
            value={1}
            label={"A2"}
          />
          <MajorNode
            x={centerX + 60 + 50}
            y={centerY + 5 - 25}
            value={1}
            label={"A4"}
          />
          <MajorNode
            x={centerX + 0 + 0}
            y={centerY - 50 - 50}
            value={1}
            label={"A6"}
          />

          {/* Minor Nodes */}
          <MinorNode
            x={centerX - 60 - 50 - 50}
            y={centerY + 5 - 25 + 40}
            value={1}
            label={"ehr"}
          />
          <MinorNode
            x={centerX - 60 - 50 - 50 + 30}
            y={centerY + 5 - 25 + 40 + 40}
            value={1}
            label={"atk"}
          />
          <MinorNode
            x={centerX - 60 - 50 - 50 + 30 + 30}
            y={centerY + 5 - 25 + 40 + 40 + 40}
            value={1}
            label={"quantum"}
          />
          
          <MinorNode
            x={centerX + 60 + 50 + 50}
            y={centerY + 5 - 25 + 40}
            value={1}
            label={"atk"}
          />
          <MinorNode
            x={centerX + 60 + 50 + 50 - 30}
            y={centerY + 5 - 25 + 40 + 40}
            value={1}
            label={"ehr"}
          />
          <MinorNode
            x={centerX + 60 + 50 + 50 - 30 - 30}
            y={centerY + 5 - 25 + 40 + 40 + 40}
            value={1}
            label={"atk"}
          />

          <MinorNode
            x={centerX + 0 + 0 + 65}
            y={centerY - 50 - 50 + 5}
            value={1}
            label={"ehr"}
          />
          <MinorNode
            x={centerX + 0 + 0 - 65}
            y={centerY - 50 - 50 + 5}
            value={1}
            label={"quantum"}
          />
          
          <MinorNode
            x={centerX + 0 + 0}
            y={centerY + 50 + 40}
            value={1}
            label={"atk"}
          />
          <MinorNode
            x={centerX + 0 + 0 + 0}
            y={centerY + 50 + 40 + 40}
            value={1}
            label={"atk"}
          />
        </svg>
      </Box>
    </Paper>
  );
};

export default HSR;
