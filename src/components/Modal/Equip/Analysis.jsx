import React, { useMemo } from "react";
import { Paper, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import Plot from "react-plotly.js";
import { AVATAR_DATA } from "@data";
import getRollValue from "@utils/getRollValue";
import simulateData from "./simulateData";

const Analysis = ({ gameId, avatarId, equipIndex, equipObj }) => {
  const weights = AVATAR_DATA[gameId][avatarId].weights;
  const mainstat = equipObj.stat;
  const substats = equipObj.statList;

  // Calculate substat score
  const rollValue = useMemo(
    () => getRollValue(gameId, substats, weights),
    [substats]
  );

  // Generate simulation data
  const simulationData = useMemo(
    () => mainstat ? simulateData(gameId, mainstat, weights).sort((a, b) => a - b) : [],
    [equipIndex, mainstat]
  );

  const binSize = 10;
  const histogramData = useMemo(() => {
    if (!mainstat || simulationData.length === 0) return {};
    
    const bins = {};
    simulationData.forEach(value => {
      const binKey = Math.floor(value / binSize) * binSize;
      bins[binKey] = (bins[binKey] || 0) + 1;
    });
    return bins;
  }, [simulationData, binSize, mainstat]);
  
  // Get the maximum bin count for y-axis scaling
  const maxBinCount = useMemo(() => {
    const counts = Object.values(histogramData);
    return counts.length > 0 ? Math.max(...counts) : 1;
  }, [histogramData]);

  if (!mainstat) {
    return (
      <Paper sx={{ p: 2 }}>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: 300 }}
        >
          <Typography variant="h6" color="text.disabled">
            No mainstat selected
          </Typography>
        </Stack>
      </Paper>
    );
  }

  const binStart = Math.floor(rollValue / binSize) * binSize;
  const rollValueCount = histogramData[binStart] || 0;

  const simMax = simulationData.at(-1);
  const rank = rollValue > simMax
    ? 1
    : simulationData.length - simulationData.findIndex(rv => rv > rollValue) + 1;
  const percent = Math.min(Math.ceil(rank / simulationData.length * 100), 100);
  const topBottom = percent <= 50
  ? `Top ${percent}%`
  : `Bottom ${101 - percent}%`;

  const plotMax = Math.max(simMax, rollValue);
  const textPosY = rollValueCount > maxBinCount * 0.95 ? "bottom" : "top";
  const textPosX =
    rollValue < plotMax * 0.05 ? "right" :
    rollValue > plotMax * 0.95 ? "left" :
    "center";
  
  const helpText = `Roll Value is a key metric used to assess the quality of substat rolls for a given character. This chart compares your substat values against those of 10,000 randomly generated artifacts featuring the same mainstat. Higher Roll Values represent more favorable outcomes for the selected character, indicating superior substat quality.`;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack justifyContent="center" alignItems="center" spacing={1} sx={{ height: 300 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">Substat Roll Value Distribution</Typography>

          <Tooltip title={helpText} arrow>
            <IconButton size="small">
              <HelpOutline fontSize="small" sx={{ color: "text.disabled" }}/>
            </IconButton>
          </Tooltip>
        </Stack>

        <Plot
          data={[
            {
              x: simulationData,
              type: "histogram",
              mode: "lines",
              name: "",
              xbins: { 
                start: 0, 
                end: 1000, 
                size: binSize,
              },
              hoverinfo: "none",
            },
            {
              x: [rollValue],
              y: [rollValueCount],
              type: "scatter",
              mode: "markers+text",
              name: "",
              text: `You (${topBottom})`,
              textposition: `${textPosY} ${textPosX}`,
              textfont: { color: "white" },
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

export default Analysis;
