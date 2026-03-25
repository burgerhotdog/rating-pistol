import { Box, Divider, Stack } from '@mui/material';
import HeaderEnka from './HeaderEnka';
import HeaderNav from './HeaderNav';
import HeaderOcr from './HeaderOcr';
import HeaderUser from './HeaderUser';

export const Header = ({ gamePath }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <HeaderNav activeGameId={gamePath} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {gamePath && (
          <>
            {gamePath === 'wuthering-waves'
              ? <HeaderOcr />
              : <HeaderEnka activeGameId={gamePath} />
            }
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <HeaderUser />
      </Stack>
    </Box>
  );
};
