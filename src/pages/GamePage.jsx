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

  const [selectedIds, setSelectedIds] = useState({});

  useEffect(() => {
    if (!gameId || charList.length === 0) return;
    if (charId && charList.includes(charId)) return;

    const fallbackId = charList.includes(selectedIds[gameId]) ? selectedIds[gameId] : charList[0];
    navigate(`/${gameId}/${fallbackId}`, { replace: true });
  }, [charId, gameId, navigate, selectedIds[gameId], charList]);

  const selectedId = charList.includes(charId) ? charId : null;
  const { baseStats, equipStats } = useComputedStats(selectedId);

  const handleSelectId = useCallback((nextCharacterId) => {
    if (!nextCharacterId || nextCharacterId === selectedId) return;
    setSelectedIds((prev) => ({
      ...prev,
      [gameId]: nextCharacterId,
    }));
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
        onSelectId={handleSelectId}
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
