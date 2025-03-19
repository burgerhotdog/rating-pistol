const TracePath = ({ startX, startY, endX, endY, isActive, isLocked }) => {
  return (
    <line 
      x1={startX} 
      y1={startY} 
      x2={endX} 
      y2={endY} 
      stroke={isActive ? "#88C0D0" : "#4C566A"} 
      strokeWidth={isActive ? 3 : 2} 
      strokeDasharray={isLocked || !isActive ? "5,5" : "none"}
      opacity={isLocked ? 0.5 : 1}
    />
  );
};

export default TracePath;
