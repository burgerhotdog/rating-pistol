import { useContext, useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { AuthContext } from '@/contexts';

const HeaderUser = () => {
  const { user, signIn, signOut } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (!user) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ cursor: 'pointer' }}
        onClick={signIn}
      >
        Sign In
      </Typography>
    );
  }

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <Avatar
          src={user.photoURL}
          alt={user.displayName}
          sx={{ width: 32, height: 32 }}
        >
          {user.displayName?.[0]}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {user.displayName}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            handleClose();
            signOut();
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderUser;