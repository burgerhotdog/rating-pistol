const Path = ({
  startX,
  startY,
  endX,
  endY,
  active = false,
  locked = false,
}) => {
  return (
    <line 
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={active ? "#88C0D0" : "#4C566A"}
      strokeWidth={3}
      opacity={locked ? 0.5 : 1}
    />
  );
};

export default Path;
