import { useParams } from 'react-router-dom';
import { Divider, Stack } from '@mui/material';
import { WW } from '@/data';
import HeaderNav from './HeaderNav';
import HeaderOcr from './header-ocr';
import HeaderEnka from './header-enka';
import HeaderUser from './HeaderUser';

const Header = () => {
  const { gameId } = useParams();

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
      }}
    >
      <HeaderNav />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}
        sx={{ alignItems: 'center' }}
      >
        {gameId === WW ? <HeaderOcr /> : <HeaderEnka />}
        <HeaderUser />
      </Stack>
    </Stack>
  );
};

export default Header;
