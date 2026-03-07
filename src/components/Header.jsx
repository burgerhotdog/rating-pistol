import { useContext } from 'react';
import { Stack, Box, Button, Divider, Typography } from '@mui/material';
import { AuthContext } from '@contexts';
import { useLocation } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import HeaderEnka from './HeaderEnka';
import HeaderOcr from './HeaderOcr';

const Header = () => {
  const { userEmail, handleAuth } = useContext(AuthContext);
  const location = useLocation();
  const activeGameId = location.pathname.slice(1);

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

        {userEmail && (
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
        )}

        <Box sx={{
          borderBottom: '1px solid transparent',
          '&:hover': {
            borderBottomColor: 'currentColor',
          },
        }}>
          <Button
            onClick={handleAuth}
            variant="text"
            sx={{
              textTransform: 'none',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {userEmail ? "Sign Out" : "Sign In"}
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Header;
