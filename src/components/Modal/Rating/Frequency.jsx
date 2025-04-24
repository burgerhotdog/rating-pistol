import { Paper } from "@mui/material";
import { AVATAR_DATA } from "@data";
import { getStrength } from "@utils";
import Plot from "react-plotly.js";

const Frequency = ({ gameId, avatarId, score, simScores, investmentLevels }) => {
  const sum = simScores.reduce((acc, score) => acc + score, 0);
  const mean = sum / simScores.length;
  const power = AVATAR_DATA[gameId][avatarId].strength / 4;

  return (
    <Paper>
      <Plot
        data={[{
          x: simScores.map(score => getStrength(score, mean, power)),
          type: "histogram",
          histnorm: "probability",
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
          },
          yaxis: {
            title: {
              text: "Frequency",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "grey",
            rangemode: "tozero",
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
