import { Paper } from "@mui/material";
import Plot from "react-plotly.js";

const Frequency = ({ gameId, avatarId, score, simScores }) => {
  return (
    <Paper>
      <Plot
        data={[{
          x: simScores,
          type: "histogram",
          histnorm: "probability",
        }]}
        layout={{
          title: {
            text: "Distribution",
            font: { color: "white" },
          },
          xaxis: {
            title: {
              text: "Relative Strength Index",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
          },
          yaxis: {
            title: {
              text: "Frequency",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "dimgrey",
            rangemode: "tozero",
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
          showlegend: false,
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          plot_bgcolor: "rgba(0, 0, 0, 0)",
        }}
        config={{ staticPlot: true }}
      />
    </Paper>
  );
};

export default Frequency;
