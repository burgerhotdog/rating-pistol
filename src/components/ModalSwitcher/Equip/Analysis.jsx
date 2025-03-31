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
    return Math.round(score * 10) * 10 * wwMulti;
  };

  // Calculate substat score
  const artifactScore = useMemo(() => getScore(Object.values(substats)), [substats]);

  // Generate Monte Carlo simulation
  const distributionData = useMemo(() => {
    const iterations = 10000;
    const scoreCounts = {};
    
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

      const score = getScore(usedSubstats);
      scoreCounts[score] ??= 0;
      scoreCounts[score]++;
    }

    const scores = Object.keys(scoreCounts).map(Number).sort((a, b) => a - b);
    let cumulativeCount = 0;
    const percentiles = scores.map(score => {
      const percentile = Math.round(cumulativeCount / iterations * 1000) / 10;
      cumulativeCount += scoreCounts[score];
      return percentile;
    });
    //const probabilities = scores.map(score => scoreCounts[score] / iterations);
    return { x: scores, y: percentiles };
  }, [equipIndex, mainstat]);

  const artifactIndex = distributionData.x.findIndex(x => Math.abs(x - (artifactScore + 10)) < 20);
  const closestIndex = distributionData.x.reduce((bestIndex, x, i) =>
    Math.abs(x - artifactScore) < Math.abs(distributionData.x[bestIndex] - artifactScore) ? i : bestIndex
  , 0);
  const artifactProbability = closestIndex !== -1 ? distributionData.y[closestIndex] : 0;

  return (
    <Paper elevation={3} display="flex" sx={{ p: 2, borderRadius: 2, width: "100%" }}>
      <Stack>
        <Plot
          data={[{
            ...distributionData,
            type: 'scatter',
            mode: 'lines',
            name: "Percentile",
            line: { color: '#1976d2', shape: 'spline' },
            showlegend: false,
          }, {
            x: [artifactScore],
            y: [artifactProbability],
            type: 'scatter',
            mode: 'markers',
            name: "Current RV%",
            marker: { color: '#d32f2f', size: 12 },
          }]}
          layout={{
            title: 'Score Distribution',
            xaxis: {
              title: "Roll Value",
              range: [0, Math.max(...distributionData.x)],
            },
            yaxis: {
              title: "Percentile",
              range: [0, 101],
            },
            dragmode: false,
            width: 450,
            height: 300,
            margin: { t: 30, b: 30, l: 30, r: 30 },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </Stack>
    </Paper>
  );
};

export default Analysis;
