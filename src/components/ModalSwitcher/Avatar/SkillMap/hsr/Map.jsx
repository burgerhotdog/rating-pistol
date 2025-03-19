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
import TraceNode from "./TraceNode";
import TracePath from "./TracePath";

const HSR = ({
  gameId,
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
    basic: { angle: -120, label: "Basic ATK" },
    skill: { angle: -40, label: "Skill" },
    ult: { angle: 40, label: "Ultimate" },
    talent: { angle: 120, label: "Talent" },
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
          {/* Draw paths from center to main traces */}
          {Object.keys(mainTraces).map(trace => {

            return (
              <TracePath
                key={`path-${trace}`}
                startX={centerX}
                startY={centerY}
                endX={mainTraces[trace].x}
                endY={mainTraces[trace].y}
                isActive={isMainTraceActive(trace)}
              />
            );
          })}
          
          {/* Draw paths from main traces to stat traces */}
          {Object.keys(statTraces).map(trace => (
            <TracePath
              key={`path-${trace}`}
              startX={statTraces[trace].parentX}
              startY={statTraces[trace].parentY}
              endX={statTraces[trace].x}
              endY={statTraces[trace].y}
              isActive={isStatTraceActive(trace)}
              isLocked={isStatTraceLocked(trace)}
            />
          ))}
          
          {/* Draw main trace nodes */}
          {Object.keys(mainTraces).map(trace => {
            const { x, y, label } = mainTraces[trace];
            const level = skillMap[trace] || '';
            const maxLevel = trace === 'basic' ? 6 : 10;
            
            return (
              <TraceNode 
                key={trace}
                x={x}
                y={y}
                type={trace}
                level={level}
                maxLevel={maxLevel}
                isActive={isMainTraceActive(trace)}
                onClick={() => handleMainNodeClick(trace)}
                label={label}
              />
            );
          })}
          
          {/* Draw stat trace nodes */}
          {Object.keys(statTraces).map(trace => {
            const { x, y, label } = statTraces[trace];
            const level = skillMap[trace] || '';
            const locked = isStatTraceLocked(trace);
            
            return (
              <TraceNode 
                key={trace}
                x={x}
                y={y}
                type="stat"
                level={level}
                maxLevel={3}
                isActive={isStatTraceActive(trace)}
                onClick={() => handleStatNodeClick(trace)}
                label={label}
                isLocked={locked}
              />
            );
          })}
          
          {/* Center node (character) */}
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={50} 
            fill="#3B4252" 
            stroke="#5E81AC" 
            strokeWidth={3} 
          />

          {/* Character initial or icon */}
          <text 
            x={centerX} 
            y={centerY} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="#E5E9F0"
            fontSize={24}
            fontWeight="bold"
          >
            HSR
          </text>
        </svg>
      </Box>
    </Paper>
  );
};

export default HSR;
