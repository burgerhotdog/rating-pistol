import { useParams } from 'react-router-dom';
import { Box, Divider, Stack } from '@mui/material';
import { WW } from '@/data';
import HeaderEnka from './HeaderEnka';
import HeaderNav from './HeaderNav';
import HeaderOcr from './Ocr/HeaderOcr';
import HeaderUser from './HeaderUser';

export const Header = () => {
  const { gameId } = useParams();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
      }}
    >
      <HeaderNav />

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {gameId === WW ? <HeaderOcr /> : <HeaderEnka />}

        <Divider orientation="vertical" flexItem />

        <HeaderUser />
      </Stack>
    </Box>
  );
};
