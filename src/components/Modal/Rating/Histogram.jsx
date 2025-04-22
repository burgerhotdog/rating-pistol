import { useMemo } from "react";
import Plot from "react-plotly.js";
const BIN_SIZE = 1;

const Histogram = ({ gameId, avatarId, percentile, score, simScores }) => {
  const histogramBins = useMemo(() => {
    const bins = {};
    simScores.forEach(simScore => {
      const binKey = Math.floor(simScore / BIN_SIZE) * BIN_SIZE;
      bins[binKey] ??= 0;
      bins[binKey]++;
    });
    return bins;
  }, [simScores, BIN_SIZE]);

  const binStart = Math.floor(score / BIN_SIZE) * BIN_SIZE;
  const scoreCount = histogramBins[binStart] || 0;

  return (
    <Plot
      data={[
        {
          x: simScores,
          type: "histogram",
          xbins: {
            start: 0,
            end: 1000,
            size: BIN_SIZE,
          },
          hoverinfo: "none",
        },
        {
          x: [score],
          y: [scoreCount],
          type: "scatter",
          mode: "markers",
          marker: { color: "red", size: 12 },
          cliponaxis: false,
          hoverinfo: "none",
        },
      ]}
      layout={{
        xaxis: {
          title: { 
            text: "Score (Higher is better)",
            font: { color: "grey" },
          },
          tickfont: { color: "grey" },
        },
        yaxis: {
          tickfont: { color: "grey" },
          gridcolor: "rgba(80, 80, 80, 0.5)",
          rangemode: "tozero",
        },
        annotations: [
          {
            x: score,
            y: scoreCount,
            text: `You (${percentile}%)`,
            font: { color: "white" },
            showarrow: true,
            arrowhead: 0,
            arrowcolor: "rgba(0, 0, 0, 0)",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            borderpad: 4,
          }
        ],
        width: 500,
        height: 300,
        margin: { t: 10, b: 40, l: 40, r: 40 },
        showlegend: false,
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
      }}
      config={{ responsive: true, displayModeBar: false, staticPlot: true }}
    />
  );
};

export default Histogram;
