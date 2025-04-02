import React, { useMemo } from "react";
import { Paper, Stack } from "@mui/material";
import Plot from "react-plotly.js";
import { DATA } from "../../importData";
import simulateData from "./simulateData";
import getRollValue from "./getRollValue";

const Analysis = ({ gameId, avatarId, equipIndex, equipObj }) => {
  const { weights } = DATA[gameId].AVATAR_DATA[avatarId];
  const { STAT_INDEX } = DATA[gameId];
  const mainstat = equipObj.key;
  const substats = Object.values(equipObj.statMap);

  // Calculate substat score
  const rollValue = useMemo(
    () => getRollValue(gameId, substats, STAT_INDEX, weights),
    [substats]
  );

  // Generate simulation data
  const distributionData = useMemo(
    () => simulateData(gameId, mainstat, weights),
    [equipIndex, mainstat]
  );

  const sortedData = [...distributionData].sort((a, b) => a - b);
  const binSize = 10;
  const binStart = Math.floor(rollValue / binSize) * binSize;
  const binEnd = binStart + binSize;
  const rollValueCount = sortedData.filter(rv => rv >= binStart && rv < binEnd).length;

  const rank = rollValue > sortedData.at(-1)
    ? 1
    : sortedData.length - sortedData.findIndex(rv => rv > rollValue) + 1;
  const percent = Math.ceil(rank / sortedData.length * 100);

  return (
    <Paper display="flex" sx={{ p: 2, width: "100%" }}>
      <Stack>
        <Plot
          data={[
            {
              x: distributionData,
              type: "histogram",
              mode: "lines",
              name: "",
              xbins: { 
                start: 0, 
                end: 800, 
                size: binSize,
              },
            },
            {
              x: [rollValue],
              y: [rollValueCount],
              type: "scatter",
              mode: "markers+text",
              name: "",
              text: `You (Top ${percent}%)`,
              textposition: "top center",
              textfont: { color: "white" },
              marker: { color: "red", size: 12 },
              cliponaxis: false,
            },
          ]}
          layout={{
            title: {
              text: "Effective Roll Value Distribution",
              font: { color: "white" },
            },
            xaxis: {
              title: { 
                text: "RV% (Higher is better)",
                font: { color: "grey" },
              },
              tickfont: { color: "grey" },
            },
            yaxis: {
              tickfont: { color: "grey" },
              gridcolor: "rgba(80, 80, 80, 0.5)",
            },
            dragmode: false,
            width: 450,
            height: 300,
            margin: { t: 40, b: 40, l: 40, r: 40 },
            showlegend: false,
            paper_bgcolor: "rgba(0, 0, 0, 0)",
            plot_bgcolor: "rgba(0, 0, 0, 0)",
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </Stack>
    </Paper>
  );
};

export default Analysis;
