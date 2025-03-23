import { useState } from "react";

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
  rankBonus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const capped = value === maxValue;
  const size = id[0] === "0" ? 46 : id[0] === "1" ? 52 : 34;

  const textContent = `${value + rankBonus} / ${maxValue + rankBonus}`;
  const textLength = textContent.length;
  const textWidth = textLength * 7;
  const padding = 6;

  return (
    <g
      onClick={locked ? undefined : () => onClick(id)}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        fill={id[0] === "0" ? "#151515" : active ? "lightgrey" : "grey"}
        stroke={isHovered ? "white" : active ? "lightgrey" : "none"}
        strokeWidth={isHovered ? 2 : 1}
      />

      {/* Image */}
      <image
        href={imageSrc}
        x={x - size/2.5}
        y={y - size/2.5}
        width={size/1.25}
        height={size/1.25}
        filter={id[0] !== "0" ? (!active ? "url(#lighterBlackFilter)" : "url(#blackFilter)") : "none"}
      />
      
      {/* Value with dark background */}
      {id[0] === "0" && (
        <>
          <rect
            x={x - textWidth / 2 - padding / 2}
            y={y + size/1.5}
            width={textWidth + padding}
            height={16}
            fill="rgba(15, 15, 15, .85)"
            rx="4"
            style={{ pointerEvents: "none" }}
          />
          <text
            x={x}
            y={y + size/1.5 + 12}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {textContent}
          </text>
        </>
      )}
    </g>
  );
};

export default Node;
