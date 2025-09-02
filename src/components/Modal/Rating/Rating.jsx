import { useState } from 'react';
import { Stack, Box, Typography, Tabs, Tab } from '@mui/material';
import { INFO_DATA } from '@data';
import { getLetter, TabLabel } from '@utils';
import Info from './Info';
import Plot from './Plot';

const Rating = ({ gameId, modalPipe }) => {
  const { EQUIP_NAMES } = INFO_DATA[gameId];
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);
  const benchmark = Math.round(rating.rolls / rating.bench * 100);
  const ratingData = rating.equips[activeTab];

  return (
    <Stack gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" color="primary">
          Overall Rating:
        </Typography>
        <Typography variant="h6">
          {benchmark.toFixed()}% ({getLetter(benchmark)}) ({rating.rolls.toFixed(2)} / {rating.bench.toFixed(2)})
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        {EQUIP_NAMES.map((name, index) => (
          <Tab key={index} label={TabLabel(gameId, name, index)} />
        ))}
      </Tabs>

      <Box display="flex" gap={2}>
        <Info
          gameId={gameId}
          avatarId={id}
          index={activeTab}
          ratingData={ratingData}
          stat={data.equipList[activeTab].stat}
        />
        <Plot
          gameId={gameId}
          stat={data.equipList[activeTab].stat}
          index={activeTab}
          ratingData={ratingData}
        />
      </Box>
    </Stack>
  );
};

export default Rating;
