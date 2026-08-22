import { useParams } from 'react-router-dom';
import { Avatar, CardHeader, Chip, Stack } from '@mui/material';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';

const PanelHeader = () => {
  const { charId } = useParams();
  const characters = useData('character');
  const { name, icon, type, element } = characters[charId];

  const { icon: elementIcon, color } = useData('element')[element];
  const { icon: typeIcon } = useData('type')[type];

  return (
    <CardHeader
      avatar={<Avatar variant="rounded" src={icon} alt={name} />}
      title={name}
      subheader={(
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
      )}
    />
  );
};

export default PanelHeader;
