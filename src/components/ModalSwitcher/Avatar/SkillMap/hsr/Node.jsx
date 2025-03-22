const Node = ({
  x,
  y,
  type,
  id,
  value,
  maxValue,
  onClick,
  imageSrc,
  active,
  locked,
}) => {
  if (type === "invis") return;
  const capped = Number(value) === maxValue;
  const size =
    type === "skill" ? 46 :
    type === "major" ? 52 : 34;

  const textContent = `${value} / ${maxValue}`;
  const textLength = textContent.length;
  const textWidth = textLength * 7; // Approximate width per character
  const padding = 6; // Extra padding for better spacing

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

      {/* Image or Text */}
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
      
      {/* Value with dark background */}
      {type === "skill" && (
        <>
          <rect
            x={x - textWidth / 2 - padding / 2}
            y={y + size/1.5}
            width={textWidth + padding}
            height={16}
            fill="rgba(0, 0, 0, 0.5)"
            rx="4"
          />
          <text
            x={x}
            y={y + size/1.5 + 12}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontWeight="bold"
          >
            {textContent}
          </text>
        </>
      )}
    </g>
  );
};

export default Node;
