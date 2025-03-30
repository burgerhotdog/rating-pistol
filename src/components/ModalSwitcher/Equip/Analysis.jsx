import React, { useState, useMemo } from 'react';
import {
  Container, Typography, Select, MenuItem, TextField,
  FormControl, InputLabel, Paper, Stack, Divider,
} from '@mui/material';
import Plot from 'react-plotly.js';

const STAT_WEIGHTS = {
  'Flat HP': 0,
  'Flat ATK': 0.25,
  'Flat DEF': 0,
  'HP%': 0,
  'ATK%': 0.75,
  'DEF%': 0,
  'Elemental Mastery': 0.25,
  'Energy Recharge': 1,
  'CRIT Rate': 1,
  'CRIT DMG': 1,
};

// Available stats
const MAINSTATS = [
  'HP%',
  'ATK%',
  'DEF%',
  'Elemental Mastery',
  'Energy Recharge',
];

const SUBSTATS = [
  'Flat HP',
  'Flat ATK',
  'Flat DEF',
  'HP%',
  'ATK%',
  'DEF%',
  'Elemental Mastery',
  'Energy Recharge',
  'CRIT Rate',
  'CRIT DMG',
];
const MAX_TOTAL_ROLLS = 8;

function App() {
  const [mainstat, setMainstat] = useState("");
  const [substats, setSubstats] = useState([
    { stat: "", rolls: 1 },
    { stat: "", rolls: 1 },
    { stat: "", rolls: 1 },
    { stat: "", rolls: 1 }
  ]);

  // Calculate total assigned rolls
  const totalRolls = substats.reduce((sum, { rolls }) => sum + rolls, 0);

  // Calculate artifact score
  const artifactScore = useMemo(() => {
    const mainScore = (STAT_WEIGHTS[mainstat] ?? 0) * 10 ; // Main stat base value
    const subScore = substats.reduce((sum, { stat, rolls }) => 
      sum + (stat ? STAT_WEIGHTS[stat] * rolls : 0), 0
    );
    return Math.round((mainScore + subScore) * 100) / 100;
  }, [mainstat, substats]);

  // Generate probability distribution using Monte Carlo simulation
  const distributionData = useMemo(() => {
    const iterations = 10000;
    const scoreCounts = {};
    
    for (let i = 0; i < iterations; i++) {
      let score = 0;
      const newMainstat = MAINSTATS[Math.floor(Math.random() * 5)]
      score += STAT_WEIGHTS[newMainstat] * 10;

      let unusedSubstats = [...SUBSTATS];
      let usedSubstats = [];
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * unusedSubstats.length);
        const newSubstat = unusedSubstats[randomIndex];
        usedSubstats.push({ stat: newSubstat, rolls: 1 });
        unusedSubstats = unusedSubstats.filter((_, index) => index !== randomIndex);
      }
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * 4);
        usedSubstats[randomIndex].rolls += 1;
      }
      score += usedSubstats.reduce((sum, { stat, rolls }) => sum + (STAT_WEIGHTS[stat] * rolls), 0);
      const roundedScore = Math.round(score * 100) / 100;

      scoreCounts[roundedScore] ??= 0;
      scoreCounts[roundedScore]++;
    }

    const scores = Object.keys(scoreCounts).map(Number).sort((a, b) => a - b);
    const probabilities = scores.map(score => scoreCounts[score] / iterations);
    return { x: scores, y: probabilities };
  }, []);

  // Handle substat changes
  const handleSubstatChange = (index, field, value) => {
    const newSubstats = [...substats];
    newSubstats[index] = { ...newSubstats[index], [field]: value };
    if (field === 'rolls' && newSubstats.reduce((sum, s) => sum + s.rolls, 0) > MAX_TOTAL_ROLLS) {
      return;
    }
    setSubstats(newSubstats);
  };

  const artifactIndex = distributionData.x.findIndex(x => Math.abs(x - artifactScore) < 0.01);
  const artifactProbability = artifactIndex !== -1 ? distributionData.y[artifactIndex] : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Genshin Artifact Scorer
        </Typography>
        <Divider />
        <Stack direction="row" spacing={3} mt={2}>
          <Stack spacing={2} sx={{ width: "50%" }}>
            <Typography align="center" variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
              Enter Stats
            </Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Mainstat</InputLabel>
              <Select
                value={mainstat}
                label="Mainstat"
                onChange={(e) => setMainstat(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#1976d2' },
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                }}
              >
                {MAINSTATS.map((stat) => (
                  <MenuItem key={stat} value={stat}>
                    {stat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Substats */}
            {substats.map((substat, index) => (
              <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Substat {index + 1}</InputLabel>
                  <Select
                    value={substat.stat}
                    label={`Substat ${index + 1}`}
                    onChange={(e) => handleSubstatChange(index, 'stat', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#1976d2' },
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                      },
                    }}
                  >
                    {SUBSTATS.filter((s) => !substats.some((ss, i) => i !== index && ss.stat === s)).map((stat) => (
                      <MenuItem key={stat} value={stat}>
                        {stat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Rolls"
                  value={substat.rolls}
                  onChange={(e) => handleSubstatChange(index, 'rolls', Number(e.target.value))}
                  sx={{
                    width: '50%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                  inputProps={{
                    min: 1,
                    max: MAX_TOTAL_ROLLS - (totalRolls - substat.rolls),
                  }}
                  disabled={!substat.stat}
                />
              </Stack>
            ))}
          </Stack>

          <Stack sx={{ width: '100%' }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
              Artifact Score: {artifactScore}
            </Typography>
            <Plot
              data={[{
                ...distributionData,
                type: 'scatter',
                mode: 'lines',
                name: 'Probability Distribution',
                line: { color: '#1976d2', shape: 'spline' },
              }, {
                x: [artifactScore],
                y: [artifactProbability],
                type: 'scatter',
                mode: 'markers',
                name: 'Your Artifact',
                marker: { color: '#d32f2f', size: 12 },
              }]}
              layout={{
                title: 'Score Distribution',
                xaxis: {
                  title: 'Score',
                  range: [0, Math.max(...distributionData.x)],
                },
                yaxis: {
                  title: 'Probability',
                  range: [0, Math.max(...distributionData.y)],
                },
                height: 400,
                margin: { t: 50, b: 50, l: 50, r: 20 },
                legend: { orientation: 'h', itemclick: false, itemdoubleclick: false },
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
