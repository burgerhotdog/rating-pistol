const Node = ({
  x,
  y,
  type,
  id,
  value,
  onClick,
  imageSrc,
  active,
  capped,
  locked,
}) => {
  if (type === "invis") return;
  const size =
    type === "skill" ? 46 :
    type === "major" ? 52 : 34;
  
  return (
    <g
      onClick={locked ? undefined : () => onClick(id, type)}
      style={{ cursor: locked ? "not-allowed" : "pointer" }}
    >
      {/* Filter definition for black coloring */}
      <defs>
        <filter id="blackFilter">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>

        {/* Lighter filter for disabled state */}
        <filter id="lighterBlackFilter">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.05
                    0 0 0 0 0.05
                    0 0 0 0 0.05
                    0 0 0 1 0"
          />
        </filter>
      </defs>

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
        fill={active ? "white" : "grey"}
      />

      {/* image */}
      {type === "minor" ? (
        <image
          href={imageSrc}
          x={x - size/2.5}
          y={y - size/2.5}
          width={size/1.25}
          height={size/1.25}
          filter={!active ? "url(#lighterBlackFilter)" : "url(#blackFilter)"}
        />
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size/3}
          fontWeight="bold"
        >
          {imageSrc}
        </text>
      )}
      
      {/* value */}
      {type === "skill" && (
        <text
          x={x}
          y={y + size/1.5 + 5}
          textAnchor="middle"
          fill="white"
          fontSize={12}
        >
          {value}
        </text>
      )}
    </g>
  );
};

export default Node;
