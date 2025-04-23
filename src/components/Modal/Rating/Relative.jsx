import Plot from "react-plotly.js";

const calculateMean = (scores) => {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

const Relative = ({ percentile, score, simScores }) => {
  const mean = calculateMean(simScores);
  const relativeScore = score / mean;
  const relativeScores = simScores.map(score => score / mean);

  return (
    <Plot
      data={[{
        x: relativeScores,
        type: "histogram",
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
          range: [0, 2],
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
          x0: relativeScore,
          x1: relativeScore,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "red", width: 2 },
        }],
        annotations: [{
          x: relativeScore,
          y: 1,
          yref: "paper",
          text: `You (${relativeScore.toFixed(2)}x)`,
          font: { color: "white" },
          showarrow: true,
          arrowhead: 0,
          arrowcolor: "red",
          ax: 0,
          ay: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderpad: 4,
        }],
        showlegend: false,
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
      }}
      config={{ responsive: true, staticPlot: true }}
    />
  );
};

export default Relative;
