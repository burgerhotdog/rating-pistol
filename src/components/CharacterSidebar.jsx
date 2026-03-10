import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { buildsContext } from '@/contexts';
import { ALL_CHARACTER_ASSETS } from '@/assets';
import { ALL_CHARACTER_LOOKUP } from '@/lookups';

const CharacterSidebar = () => {
  const { gameId } = useParams();
  const { buildDatas } = useContext(buildsContext);
  const buildData = buildDatas[gameId] ?? {};
  const CHARACTER_LOOKUP = ALL_CHARACTER_LOOKUP[gameId] ?? {};
  const CHARACTER_ASSETS = ALL_CHARACTER_ASSETS[gameId] ?? {};

  const sortedChars = useMemo(() => {
    return Object.keys(buildData).sort((aId, bId) => {
      // Prioritize pinned character
      if (aId === pinnedId) return -1;
      if (bId === pinnedId) return 1;

      // Sort alphabetically by name
      const aName = CHARACTER_LOOKUP[aId]?.name || '';
      const bName = CHARACTER_LOOKUP[bId]?.name || '';
      return aName.localeCompare(bName);
    });
  }, [buildData, pinnedId]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 72,
      flexShrink: 0,
    }}>
      <Box sx={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        py: 1,
        px: 0.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'sticky',
          bottom: 0,
          display: 'block',
          width: '100%',
          height: 40,
          flexShrink: 0,
          background: (theme) =>
            `linear-gradient(transparent, ${theme.palette.background.default})`,
          pointerEvents: 'none',
        },
      }}>
        {sortedChars.map((charId, index) => (
          <Avatar
            key={charId}
            src={CHARACTER_ASSETS[charId]}
            onClick={() => setSelected(index)}
            sx={{
              width: 46,
              height: 46,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              outline: selected === index
                ? '2px solid'
                : '2px solid transparent',
              outlineColor: selected === index
                ? 'primary.main'
                : 'transparent',
              outlineOffset: 2,
              opacity: selected === index ? 1 : 0.55,
              filter: selected === index ? 'none' : 'grayscale(0.4)',
              '&:hover': {
                opacity: 1,
                filter: 'none',
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CharacterSidebar;
