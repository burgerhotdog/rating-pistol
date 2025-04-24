import { useMemo } from "react";
import Plot from "react-plotly.js";
import { Paper } from "@mui/material";

const calculateMean = (scores) => {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

const RelativeStrengthPlot = ({ percentile, score, simScores }) => {
  const mean = calculateMean(simScores);
  const scoreRelativeStrength = score / mean;
  const relativeStrength = simScores.map((score) => (score / mean));
  const percentileData = useMemo(
    () => simScores.map((_, index) => (index + 1) / simScores.length),
    [simScores]
  );

  return (
    <Paper>
      <Plot
        data={[{
          x: relativeStrength,
          y: percentileData,
          type: "scatter",
          mode: "lines",
          name: "Relative to Mean",
        }]}
        layout={{
          title: {
            text: "Build Strength in relation to Average",
            font: { color: "white" },
          },
          xaxis: {
            title: {
              text: "Relative Strength",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "grey",
          },
          yaxis: {
            title: {
              text: "Percentile",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "grey",
            range: [0, 1],
          },
          shapes: [{
            type: "line",
            x0: scoreRelativeStrength,
            x1: scoreRelativeStrength,
            y0: 0,
            y1: 1,
            yref: "paper",
            line: { color: "red", width: 2 },
          }],
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          plot_bgcolor: "rgba(0, 0, 0, 0)",
        }}
        config={{ staticPlot: true }}
      />
    </Paper>
  );
};

export default RelativeStrengthPlot;