import { Paper } from "@mui/material";
import Plot from "react-plotly.js";

const RelativeStrengthPlot = ({ gameId, avatarId, score, simScores }) => {
  const downsampled = simScores.filter((_, index) => index % 10 === 0);

  return (
    <Paper>
      <Plot
        data={[{
          x: downsampled,
          y: downsampled.map((_, index) => ((index + 1) / downsampled.length) * 100),
          type: "scatter",
          mode: "lines",
        }]}
        layout={{
          title: {
            text: "Percentile",
            font: { color: "white" },
          },
          xaxis: {
            title: {
              text: "Relative Strength Index",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "dimgrey",
          },
          yaxis: {
            title: {
              text: "Percentile",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "dimgrey",
            range: [0, 100.5],
            tickvals: [0, 25, 50, 75, 100],
          },
          shapes: [{
            type: "line",
            x0: score,
            x1: score,
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