import { Box, Divider, Stack } from '@mui/material';
import HeaderEnka from './HeaderEnka';
import HeaderNav from './HeaderNav';
import HeaderOcr from './HeaderOcr';
import HeaderUser from './HeaderUser';

export const Header = ({ gameId }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <HeaderNav gamePath={gameId} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {gameId && (
          <>
            {gameId === 'wuthering-waves'
              ? <HeaderOcr />
              : <HeaderEnka gamePath={gameId} />
            }
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <HeaderUser />
      </Stack>
    </Box>
  );
};
