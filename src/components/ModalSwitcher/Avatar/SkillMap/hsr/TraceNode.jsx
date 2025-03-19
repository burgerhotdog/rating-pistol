const TraceNode = ({
  x,
  y,
  size = 40,
  type,
  level,
  maxLevel,
  isActive,
  onClick,
  label,
  isLocked = false,
}) => {
  // Color mapping based on trace type
  const typeColors = {
    basic: "#5E81AC",
    skill: "#81A1C1",
    ult: "#B48EAD",
    talent: "#A3BE8C",
    stat: {
      hp: "#BF616A",
      atk: "#D08770",
      def: "#EBCB8B",
      spd: "#88C0D0"
    }
  };

  // Determine the color based on trace type
  let color;
  if (type === 'stat') {
    color = typeColors.stat[label.toLowerCase()] || "#D8DEE9";
  } else {
    color = typeColors[type] || "#EBCB8B";
  }

  const activeColor = isActive ? color : "#4C566A";
  const textColor = isActive ? "white" : "#D8DEE9";
  
  return (
    <g onClick={!isLocked ? onClick : undefined} style={{ cursor: isLocked ? "not-allowed" : "pointer" }}>
      {/* Outer circle */}
      <circle 
        cx={x}
        cy={y}
        r={size/2}
        fill="#2E3440"
        stroke={activeColor}
        strokeWidth={isActive ? 3 : 2}
      />
      
      {/* Lock indicator for locked nodes */}
      {isLocked && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D8DEE9"
          fontSize={size/2.5}
        >
          🔒
        </text>
      )}
      
      {/* Inner circle for level indicator (only for non-locked nodes) */}
      {!isLocked && (
        <circle 
          cx={x} 
          cy={y} 
          r={size/3} 
          fill={activeColor} 
        />
      )}
      
      {/* Level text (only for non-locked nodes with level) */}
      {!isLocked && level && (
        <text 
          x={x} 
          y={y} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill={textColor}
          fontSize={size/3}
          fontWeight="bold"
        >
          {level}
        </text>
      )}
      
      {/* Label text */}
      <text 
        x={x} 
        y={y + size/1.5 + 5} 
        textAnchor="middle" 
        fill="#E5E9F0"
        fontSize={12}
      >
        {label}
      </text>
    </g>
  );
};

export default TraceNode;
