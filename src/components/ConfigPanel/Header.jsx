import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  CardHeader,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';

const Header = () => {
  const { charId } = useParams();
  const characters = useData('character');
  const { name, icon, type, element } = characters[charId];

  const { icon: elementIcon, color } = useData('element')[element];
  const { icon: typeIcon } = useData('type')[type];

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    // your edit handler here
  };

  const handleDelete = () => {
    handleMenuClose();
    // your delete handler here
  };

  const renderChips = () => (
    <Stack direction="row" spacing={0.5}>
      <Chip
        variant="outlined"
        avatar={<Avatar src={elementIcon} />}
        label={formatStr(element)}
        sx={{ fontWeight: 'bold', color }}
      />
      <Chip
        variant="outlined"
        avatar={<Avatar src={typeIcon} />}
        label={formatStr(type)}
        sx={{ fontWeight: 'bold' }}
      />
    </Stack>
  );

  const renderAction = () => (
    <Stack direction="row" spacing={0.5}>
      <Checkbox
        icon={<StarBorder />}
        checkedIcon={<Star />}
      />
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>
            Edit build
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>
            Delete build
          </ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );

  return (
    <CardHeader
      avatar={<Avatar src={icon} alt={name} />}
      title={name}
      subheader={renderChips()}
      action={renderAction()}
    />
  );
};

export default Header;
