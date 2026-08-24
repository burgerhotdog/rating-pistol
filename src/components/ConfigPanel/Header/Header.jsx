import { useParams } from 'react-router-dom';
import { Avatar, CardHeader, Chip, Stack } from '@mui/material';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';
import HeaderActions from './HeaderActions';

const Header = () => {
  const { charId } = useParams();
  const character = useData('character')[charId];
  const element = useData('element')[character.element];
  const type = useData('type')[character.type];

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
      action={<HeaderActions />}
    />
  );
};

export default Header;
