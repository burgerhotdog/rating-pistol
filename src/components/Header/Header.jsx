import { useParams } from 'react-router-dom';
import { Box, Divider, Stack } from '@mui/material';
import HeaderEnka from './HeaderEnka';
import HeaderNav from './HeaderNav';
import HeaderOcr from './HeaderOcr';
import HeaderUser from './HeaderUser';

export const Header = () => {
  const { gameId } = useParams();
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <HeaderNav />

      <Stack direction="row" alignItems="center" spacing={1}>
        {gameId === 'wuthering-waves' ? <HeaderOcr /> : <HeaderEnka />}
        <Divider orientation="vertical" flexItem />
        <HeaderUser />
      </Stack>
    </Box>
  );
};
