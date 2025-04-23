import Plot from "react-plotly.js";
const BIN_SIZE = 1;

const Histogram = ({ gameId, avatarId, percentile, score, simScores }) => {
  return (
    <Plot
      data={[{
        x: simScores,
        type: "histogram",
        xbins: {
          start: 0,
          end: 1000,
          size: BIN_SIZE,
        },
        hoverinfo: "none",
      }]}
      layout={{
        xaxis: {
          title: { 
            text: "Score (Higher is better)",
            font: { color: "grey" },
          },
          tickfont: { color: "grey" },
          rangemode: "tozero",
        },
        yaxis: {
          tickfont: { color: "grey" },
          gridcolor: "rgba(80, 80, 80, 0.5)",
          rangemode: "tozero",
        },
        shapes: [{
          type: "line",
          x0: score,
          x1: score,
          y0: 0,
          y1: 1,
          line: { color: "red", width: 2 },
          yref: "paper",
        }],
        annotations: [{
          x: score,
          y: 1,
          yref: "paper",
          text: `You (${percentile.toFixed(2)}%)`,
          font: { color: "white" },
          showarrow: true,
          arrowhead: 0,
          arrowcolor: "red",
          ax: 0,
          ay: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderpad: 4,
        }],
        width: 500,
        height: 300,
        margin: { t: 10, b: 40, l: 40, r: 40 },
        showlegend: false,
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
      }}
      config={{ responsive: true, staticPlot: true }}
    />
  );
};

export default Histogram;
