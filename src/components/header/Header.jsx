import { useParams } from 'react-router-dom';
import { Divider, Stack } from '@mui/material';
import { WW } from '@/data';
import Nav from './Nav';
import Ocr from './Ocr';
import Enka from './Enka';
import User from './User';

const Header = () => {
  const { gameId } = useParams();

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: 'space-between', alignItems: 'center', py: 2 }}
    >
      <Nav />
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {gameId === WW ? <Ocr /> : <Enka />}
        <Divider orientation="vertical" flexItem />
        <User />
      </Stack>
    </Stack>
  );
};

export default Header;
