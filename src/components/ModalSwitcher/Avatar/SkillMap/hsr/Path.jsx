const Path = ({
  x1,
  y1,
  x2,
  y2,
  active = false,
  locked = false,
}) => {
  return (
    <line 
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={active ? "#88C0D0" : "#4C566A"}
      strokeWidth={3}
      opacity={locked ? 0.5 : 1}
    />
  );
};

export default Path;
