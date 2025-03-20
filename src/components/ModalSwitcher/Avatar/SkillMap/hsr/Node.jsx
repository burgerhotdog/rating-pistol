const Node = ({
  x,
  y,
  type,
  id,
  value,
  onClick,
  label,
  active,
  capped,
  locked,
}) => {
  const size =
    type === "skill" ? 40 :
    type === "major" ? 50 : 30;
  
  return (
    <g
      onClick={locked ? undefined : () => onClick(id, type)}
      style={{ cursor: locked ? "not-allowed" : "pointer" }}
    >
      {/* Ring */}
      <circle 
        cx={x}
        cy={y}
        r={size/2 + 3}
        fill="none"
        stroke={capped || locked ? "none" : "cornflowerblue"}
        strokeWidth={3}
      />
      
      {/* Circle */}
      <circle
        cx={x}
        cy={y}
        r={size/2}
        fill={active ? "white" : "dimgrey"}
      />
      
      {/* label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size/3}
        fontWeight="bold"
      >
        {label}
      </text>
      
      {/* value */}
      <text
        x={x}
        y={y + size/1.5 + 5}
        textAnchor="middle"
        fill="white"
        fontSize={12}
      >
        {value}
      </text>
    </g>
  );
};

export default Node;
