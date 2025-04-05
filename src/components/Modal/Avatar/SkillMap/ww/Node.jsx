const Node = ({
  x,
  y,
  id,
  value,
  maxValue,
  onClick,
  imageSrc,
  active,
  locked,
  hoveredNode,
  setHoveredNode,
}) => {
  const isHovered = hoveredNode === id;
  const maxed = value === maxValue;
  const size = id[0] === "0" ? 46 : id[0] === "1" ? 52 : 34;

  const textContent = `${value} / ${maxValue}`;
  const textLength = textContent.length;
  const textWidth = textLength * 9;

  return (
    <g
      onClick={() => onClick(id)}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHoveredNode(id)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      {/* Black filter */}
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

        {/* Lighter black filter */}
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

      {/* Blue Ring */}
      <circle 
        cx={x}
        cy={y}
        r={size / 2 + 3}
        fill="none"
        stroke={locked || maxed ? "none" : "cornflowerblue"}
        strokeWidth={3}
        style={{ pointerEvents: "none" }}
      />
      
      {/* Circle */}
      <circle
        cx={x}
        cy={y}
        r={size/2}
        fill={id[0] === "0" ? "#151515" : active ? "lightgrey" : "grey"}
        stroke={isHovered ? "white" : active ? "lightgrey" : "none"}
        strokeWidth={isHovered ? 2 : 1}
      />

      {/* Image */}
      <image
        href={imageSrc}
        x={x - size / 2.5}
        y={y - size / 2.5}
        width={size / 1.25}
        height={size / 1.25}
        filter={id[0] !== "0" ? (!active ? "url(#lighterBlackFilter)" : "url(#blackFilter)") : "none"}
      />
      
      {/* Value with dark background */}
      {id[0] === "0" && (
        <g style={{ pointerEvents: "none" }}>
          <rect
            x={x - textWidth / 2}
            y={y + size / 1.5 - 8}
            width={textWidth}
            height={22}
            fill="rgba(20, 20, 20, .8)"
            rx="10"
          />
          <text
            x={x}
            y={y + size / 1.5 + 4}
            textAnchor="middle"
            fill="white"
            fontSize={16}
            dominantBaseline="middle"
          >
            {textContent}
          </text>
        </g>
      )}
    </g>
  );
};

export default Node;
