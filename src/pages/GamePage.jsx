import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { UserDataContext } from '@/contexts';
import { useSortCharIds, useComputedStats } from '@/hooks';

const GamePage = () => {
  const navigate = useNavigate();
  const { gameId, charId } = useParams();
  const charList = useSortCharIds(gameId);

  useEffect(() => {
    if (charList.length === 0) return;
    if (charList.includes(charId)) return;
    navigate(`/${gameId}/${charList[0]}`, { replace: true });
  }, [gameId, charId, charList, navigate]);

  const selectedId = charList.includes(charId) ? charId : null;
  const { baseStats, equipStats } = useComputedStats(selectedId);

  const handleSelectId = useCallback((nextCharacterId) => {
    if (!nextCharacterId || nextCharacterId === selectedId) return;
    navigate(`/${gameId}/${nextCharacterId}`, { replace: true });
  }, [gameId, navigate, selectedId]);

  if (!charList.includes(charId)) {
    return (
      <Typography>wait</Typography>
    );
  }

  return (
    <Stack
      direction="row"
      overflow="hidden"
      gap={2}
      pb={2}
    >
      <Sidebar
        charList={charList}
      />

      <StatsPanel
        baseStats={baseStats}
        equipStats={equipStats}
      />

      {/* ── Graphs panel ── */}
      <Stack gap={2}>
        {false && (
          <>
            <CustomLineChart />

            <Stack direction="row" gap={2}>
              <CustomRadarChart />
              <CustomTable />
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default GamePage;
