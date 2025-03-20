const Node = ({
  x,
  y,
  type,
  value = null,
  onClick,
  label,
  active = false,
  locked = false,
}) => {
  const size = type === "skill" ? 30 : type === "major" ? 35 : 25;
  const activeColor = active ? "#81A1C1" : "#4C566A";
  const textColor = active ? "white" : "#D8DEE9";
  
  return (
    <g
      onClick={!locked ? onClick : undefined}
      style={{ cursor: locked ? "not-allowed" : "pointer" }}
    >
      {/* Outer circle */}
      <circle 
        cx={x}
        cy={y}
        r={size/2}
        fill="#2E3440"
        stroke={activeColor}
        strokeWidth={active ? 3 : 2}
      />
      
      {/* Lock indicator for locked nodes */}
      {locked && (
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
      
      {/* Inner circle for value indicator (only for non-locked nodes) */}
      {!locked && (
        <circle 
          cx={x} 
          cy={y} 
          r={size/3} 
          fill={activeColor} 
        />
      )}
      
      {/* Level text (only for non-locked nodes with value) */}
      {!locked && value && (
        <text 
          x={x} 
          y={y} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill={textColor}
          fontSize={size/3}
          fontWeight="bold"
        >
          {value}
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

export default Node;
