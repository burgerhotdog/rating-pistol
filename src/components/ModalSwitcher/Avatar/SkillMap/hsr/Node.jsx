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
  const maxed = value === maxValue;
  const size = id[0] === "0" ? 46 : id[0] === "1" ? 52 : 34;

  const textContent = `${value + rankBonus} / ${maxValue + rankBonus}`;
  const textLength = textContent.length;
  const textWidth = textLength * 9;

  return (
    <g
      onClick={() => onClick(id)}
      style={{ cursor: "pointer" }}
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
            x={x - textWidth / 2}
            y={y + size / 1.5 - 8}
            width={textWidth}
            height={22}
            fill="rgba(20, 20, 20, .8)"
            rx="10"
            style={{ pointerEvents: "none" }}
          />
          <text
            x={x}
            y={y + size / 1.5 + 4}
            textAnchor="middle"
            fill={rankBonus ? "cyan" : "white"}
            fontSize={16}
            dominantBaseline="middle"
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
