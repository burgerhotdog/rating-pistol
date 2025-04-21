import { useMemo } from "react";
import { Paper, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import Plot from "react-plotly.js";
const BIN_SIZE = 0.1;

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
  
  // Get the maximum bin count for y-axis scaling
  const maxBinCount = useMemo(() => {
    const counts = Object.values(histogramBins);
    return counts.length > 0 ? Math.max(...counts) : 1;
  }, [histogramBins]);

  const binStart = Math.floor(score / BIN_SIZE) * BIN_SIZE;
  const rollValueCount = histogramBins[binStart] || 0;

  const simMax = simScores.at(-1);
  const plotMax = Math.max(simMax, score);
  
  const helpText = "help";

  return (
    <Paper sx={{ p: 2 }}>
      <Stack justifyContent="center" alignItems="center" spacing={1} sx={{ height: 300 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">Score Distribution</Typography>

          <Tooltip title={helpText}>
            <IconButton size="small">
              <HelpOutline fontSize="small" sx={{ color: "text.disabled" }}/>
            </IconButton>
          </Tooltip>
        </Stack>

        <Plot
          data={[
            {
              x: simScores,
              type: "histogram",
              mode: "lines",
              name: "",
              xbins: {
                start: 0,
                end: 1000,
                size: BIN_SIZE,
              },
              hoverinfo: "none",
            },
            {
              x: [score],
              y: [rollValueCount],
              type: "scatter",
              mode: "markers",
              name: "",
              marker: { color: "red", size: 12 },
              cliponaxis: false,
              hoverinfo: "none",
            },
          ]}
          layout={{
            xaxis: {
              title: { 
                text: "RV% (Higher is better)",
                font: { color: "grey" },
              },
              tickfont: { color: "grey" },
              range: [0, plotMax],
            },
            yaxis: {
              tickfont: { color: "grey" },
              gridcolor: "rgba(80, 80, 80, 0.5)",
              range: [0, maxBinCount],
            },
            annotations: [
              {
                x: score,
                y: rollValueCount,
                text: `You (${percentile}%)`,
                font: { color: "white" },
                showarrow: false,
                yshift: rollValueCount > maxBinCount * 0.95 ? -20 : 15,
                xshift: score < plotMax * 0.05 ? 10 : 
                        score > plotMax * 0.95 ? -10 : 0,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                borderpad: 4,
                bordercolor: "rgba(0, 0, 0, 0)",
                borderwidth: 0,
                borderradius: 4,
              }
            ],
            dragmode: false,
            width: 450,
            height: 250,
            margin: { t: 10, b: 40, l: 40, r: 40 },
            showlegend: false,
            paper_bgcolor: "rgba(0, 0, 0, 0)",
            plot_bgcolor: "rgba(0, 0, 0, 0)",
          }}
          config={{ responsive: true, displayModeBar: false, staticPlot: true }}
        />
      </Stack>
    </Paper>
  );
};

export default Histogram;
