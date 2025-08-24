import { useState } from 'react';
import { Box, Stack, Typography, Tabs, Tab, Divider } from '@mui/material';
import { EQUIP_ASSETS, RATING_ASSETS } from '@assets';
import { AVATAR_DATA, INFO_DATA } from '@data';
import Info from './Info';
import Plot from './Plot';

const RATING_RANK = ['Excellent', 'Great', 'Good', 'Poor'];

const Rating = ({ gameId, modalPipe }) => {
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);

  const ratingData = rating.equips[activeTab];

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" color="primary">
          Rating:
        </Typography>
        <Box
          component="img"
          alt={RATING_RANK['']}
          src={RATING_ASSETS['']}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="h6">
          {RATING_RANK['']}
        </Typography>
      </Stack>
      <Typography variant="body2">
        {AVATAR_DATA[gameId][id].name} has a roll value of {rating.avatar.score.toFixed()}%
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        {INFO_DATA[gameId].EQUIP_NAMES.map((name, index) => (
          <Tab
            key={index}
            label={(
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  src={EQUIP_ASSETS[gameId][index]}
                  sx={{ width: 24, height: 24, objectFit: 'contain' }}
                />
                <Typography variant="body2">
                  {name}
                </Typography>
              </Stack>
            )}
          />
        ))}
      </Tabs>

      <Stack direction="row" spacing={2}>
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
      </Stack>
    </Stack>
  );
};

export default Rating;
