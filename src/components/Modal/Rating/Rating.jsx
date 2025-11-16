import { useState } from 'react';
import { Stack, Box, Typography, Tabs, Tab, Tooltip } from '@mui/material';
import { INFO_DATA } from '@data';
import { getLetter, TabLabel } from '@utils';
import Breakdown from './Breakdown';
import Analysis from './Analysis';
import Plot from './Plot';
import useTimeAgo from "./useTimeAgo";

const Rating = ({ gameId, modalPipe }) => {
  const { EQUIP_NAMES } = INFO_DATA[gameId];
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);
  const benchmark = Math.round(rating.rolls / rating.bench * 100);
  const ratingData = rating.equips[activeTab];

  return (
    <Stack gap={2}>
      <Box display="flex" alignItems="flex-end" gap={1}>
        <Typography variant="h6" color="primary">
          Overall Rating:
        </Typography>
        <Typography variant="h6">
          {benchmark.toFixed()}% ({getLetter(benchmark)})
        </Typography>
        <Box flexGrow={1} />
        <Typography variant="body1" color="text.secondary">
          Last Updated: {
            <Tooltip
              title={new Date(data.updatedAt).toLocaleString()}
              arrow
            >
              {useTimeAgo(data.updatedAt)}
            </Tooltip>
          }
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
        <Stack gap={2}>
          <Breakdown
            gameId={gameId}
            avatarId={id}
            ratingData={ratingData}
            mainstat={data.equipList[activeTab].stat}
            statList={data.equipList[activeTab].statList}
          />
          <Analysis
            gameId={gameId}
            index={activeTab}
            ratingData={ratingData}
            stat={data.equipList[activeTab].stat}
          />
        </Stack>
        <Plot rolls={ratingData.rolls} dataset={ratingData.dataset} />
      </Box>
    </Stack>
  );
};

export default Rating;
