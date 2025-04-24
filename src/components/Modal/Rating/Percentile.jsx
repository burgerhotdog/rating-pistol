import { Paper } from "@mui/material";
import { AVATAR_DATA } from "@data";
import { getStrength } from "@utils";
import Plot from "react-plotly.js";

const RelativeStrengthPlot = ({ gameId, avatarId, score, simScores, investmentLevels }) => {
  const sum = simScores.reduce((acc, score) => acc + score, 0);
  const mean = sum / simScores.length;
  const power = AVATAR_DATA[gameId][avatarId].strength / 4;
  const downsampled = simScores.filter((_, index) => index % 10 === 0);

  return (
    <Paper>
      <Plot
        data={[{
          x: downsampled.map((score) => getStrength(score, mean, power)),
          y: downsampled.map((_, index) => ((index + 1) / downsampled.length) * 100),
          type: "scatter",
          mode: "lines",
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
            range: [0, 100.5],
            tickvals: [0, 25, 50, 75, 100],
          },
          shapes: [{
            type: "line",
            x0: getStrength(score, mean, power),
            x1: getStrength(score, mean, power),
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