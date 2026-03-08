import { useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AuthContext } from '@contexts';

const HeaderUser = () => {
  const { userEmail, signIn, signOut } = useContext(AuthContext);

  return (
    <>
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
          onClick={userEmail ? signOut : signIn}
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
    </>
  );
};

export default HeaderUser;
