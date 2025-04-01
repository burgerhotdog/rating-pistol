import React, { useMemo } from "react";
import { Paper, Stack } from "@mui/material";
import getData from "../../getData";
import Plot from "react-plotly.js";
import {
  addSubstatWeights,
  getRandValueMultiplier,
} from "./simulationConstants";

const Analysis = ({ gameId, avatarId, equipIndex, equipObj }) => {
  const { weights } = getData[gameId].AVATAR_DATA[avatarId];
  const { STAT_INDEX } = getData[gameId];
  const mainstat = equipObj.key;
  const substats = equipObj.statMap;

  const getScore = (statMap) => {
    const score = statMap.reduce((acc, { key, value }) => {
      if (!key) return acc;
      const rolls = Number(value) / STAT_INDEX[key].valueSub;
      return acc + ((weights[key] ?? 0) * rolls);
    }, 0);
    const wwMulti = gameId === "ww" ? 2 : 1;
    return Math.round(score * 100) * wwMulti;
  };

  // Calculate substat score
  const artifactScore = useMemo(() => getScore(Object.values(substats)), [substats]);

  // Generate Monte Carlo simulation
  const distributionData = useMemo(() => {
    const iterations = 10000;
    const scores = [];
    
    for (let i = 0; i < iterations; i++) {
      // remove mainstat from substat pool
      let unusedSubstats = addSubstatWeights[gameId].filter(([stat]) =>
        gameId === "ww" || stat !== mainstat
      );

      // adding each substat line (weighted selection)
      let usedSubstats = [];
      const numLines = gameId === "ww" ? 5 : 4;
      for (let j = 0; j < numLines; j++) {
        const totalWeight = unusedSubstats.reduce((acc, [, weight]) => acc + weight, 0);
        const randNum = Math.floor(Math.random() * totalWeight) + 1;
        let cumulative = 0;
        for (let k = 0; k < unusedSubstats.length; k++) {
          const [key, weight] = unusedSubstats[k];
          cumulative += weight;
          if (randNum > cumulative) continue;
          const mult = getRandValueMultiplier(gameId);
          const value = STAT_INDEX[key].valueSub * mult;
          usedSubstats.push({ key, value });
          unusedSubstats.splice(k, 1);
          break;
        }
      }

      // adding the rest of the rolls
      if (gameId !== "ww") {
        const upgradeTimes = Math.floor(Math.random() * 4) ? 4 : 5;
        for (let j = 0; j < upgradeTimes; j++) {
          const randomIndex = Math.floor(Math.random() * 4);
          const key = usedSubstats[randomIndex].key;
          const mult = getRandValueMultiplier(gameId);
          usedSubstats[randomIndex].value += STAT_INDEX[key].valueSub * mult;
        }
      }

      scores.push(getScore(usedSubstats));
    }
    return scores;
  }, [equipIndex, mainstat]);
  // Ensure distributionData is sorted for binary search (if necessary)
  const sortedScores = [...distributionData].sort((a, b) => a - b);

  // Determine bin size (same as histogram)
  const binSize = 10;

  // Find the bin that artifactScore belongs to
  const binStart = Math.floor(artifactScore / binSize) * binSize;
  const binEnd = binStart + binSize;

  // Count occurrences of scores within the bin range
  const artifactProbability = sortedScores.filter(score => score >= binStart && score < binEnd).length;


  return (
    <Paper display="flex" sx={{ p: 2, width: "100%" }}>
      <Stack>
        <Plot
          data={[{
            x: distributionData,
            type: "histogram",
            mode: "lines",
            name: "",
            xbins: { 
              start: 0, 
              end: 800, 
              size: 10,
            },
          }, {
            x: [artifactScore],
            y: [artifactProbability],
            type: "scatter",
            mode: "markers+text",
            name: "",
            text: ["You"],
            textposition: "top center",
            marker: { color: "red", size: 12 },
          }]}
          layout={{
            title: { text: "Effective Roll Value Distribution" },
            xaxis: {
              title: { text: "Substat RV% (Higher is better)" },
              range: [0, 800],
              tickfont: { color: "grey" },
              gridcolor: "grey",
              showgrid: false
            },
            yaxis: {
              range: [0, 1000],
              tickfont: { color: "grey" },
              gridcolor: "grey",
              showgrid: false
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
