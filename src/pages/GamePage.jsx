import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  Bar,
  BuffPanel,
} from '@/components';
import { computeRating, collectTeamBuffs } from '@/utils';
import { useCurrent, useSimulation } from '@/hooks';

const GamePage = () => {
  const { gameId, characterId } = useParams();
  const { build, criteria } = useCurrent();

  const [draftTeam, setDraftTeam] = useState([]);
  const [appliedTeam, setAppliedTeam] = useState([]);

  const buffs = useMemo(
    () => collectTeamBuffs(gameId, appliedTeam),
    [gameId, appliedTeam]
  );

  const rating = build && criteria
    ? computeRating(gameId, characterId, build, criteria[0], buffs)
    : null;

  const { completed, weeklyRatings, finalStats, isLoading } = useSimulation(0, buffs);

  return (
    <Box
      display="flex"
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        pb: 4,
        gap: 1,
      }}
    >
      <Sidebar />
      <Stack>
        <StatsPanel />
        <BuffPanel
          gameId={gameId}
          mainCharacterId={characterId}
          draftTeam={draftTeam}
          appliedTeam={appliedTeam}
          setDraftTeam={setDraftTeam}
          onApply={() => setAppliedTeam(draftTeam)}
          onReset={() => {
            setDraftTeam([]);
            setAppliedTeam([]);
          }}
        />
      </Stack>

      {criteria && (
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Bar completed={completed} />
          <CustomLineChart
            weeklyRatings={weeklyRatings}
            rating={rating}
            isLoading={isLoading}
          />

          <Box display="flex" gap={1} sx={{ flex: 1 }}>
            <CustomRadarChart
              charId={characterId}
              build={build}
              combinedSimEquips={finalStats}
              isLoading={isLoading}
            />

            <CustomTable
              build={build}
              rating={rating}
              buffs={buffs}
              isLoading={isLoading}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default GamePage;
