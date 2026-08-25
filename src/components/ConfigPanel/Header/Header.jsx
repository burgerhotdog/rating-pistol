import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, CardHeader, Checkbox, Chip, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';
import EditDialog from './EditDialog';

const Header = () => {
  const { charId } = useParams();
  const character = useData('character')[charId];
  const element = useData('element')[character.element];
  const type = useData('type')[character.type];

  const [open, setOpen] = useState(false);

  return (
    <CardHeader
      avatar={<Avatar src={character.icon} alt={character.name} />}
      title={character.name}
      subheader={(
        <Stack direction="row" spacing={0.5}>
          <Chip
            variant="outlined"
            avatar={<Avatar src={element.icon} />}
            label={formatStr(character.element)}
            sx={{ fontWeight: 'bold', color: element.color }}
          />
          <Chip
            variant="outlined"
            avatar={<Avatar src={type.icon} />}
            label={formatStr(character.type)}
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      )}
      action={(
        <Stack direction="row" spacing={0.5}>
          <Checkbox
            icon={<StarBorder />}
            checkedIcon={<Star />}
          />
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ alignSelf: 'center' }}
          >
            <EditIcon />
          </IconButton>
          <EditDialog
            open={open}
            onClose={() => setOpen(false)}
          />
        </Stack>
      )}
    />
  );
};

export default Header;
