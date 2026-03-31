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
      <HeaderNav gamePath={gamePath} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {gamePath && (
          <>
            {gamePath === 'wuthering-waves'
              ? <HeaderOcr />
              : <HeaderEnka gamePath={gamePath} />
            }
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <HeaderUser />
      </Stack>
    </Box>
  );
};
