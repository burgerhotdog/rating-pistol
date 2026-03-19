import { useLocation } from 'react-router-dom';
import { Box, Divider, Stack } from '@mui/material';
import HeaderEnka from './HeaderEnka';
import HeaderNav from './HeaderNav';
import HeaderOcr from './HeaderOcr';
import HeaderUser from './HeaderUser';

export const Header = () => {
  const location = useLocation();
  const activeGameId = location.pathname.split('/').filter(Boolean)[0] ?? '';

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <HeaderNav activeGameId={activeGameId} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {activeGameId && (
          <>
            {activeGameId === 'wuthering-waves'
              ? <HeaderOcr />
              : <HeaderEnka activeGameId={activeGameId} />
            }
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <HeaderUser />
      </Stack>
    </Box>
  );
};
