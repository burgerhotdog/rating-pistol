import { useParams } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Switch, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CHARACTERS } from '@/data';

export const BuffPanel = ({ buffs, setBuffs }) => {
  const { gameId, charId } = useParams();
  const allBuffs = Object.entries(CHARACTERS[gameId])
    .filter(([id, { TEAM_BUFFS }]) => TEAM_BUFFS && (charId !== id))
    .map(([id]) => id);

  if (!presets || presets.length === 0) return null;

  return (
    <Accordion defaultExpanded variant="outlined" disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" fontWeight="bold">Buffs</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Stack gap={0.5}>
          {allBuffs.map(id => (
            <FormControlLabel
              key={id}
              control={
                <Switch
                  size="small"
                  checked={!!buffs[id]}
                  onChange={() => toggleBuff(id)}
                />
              }
              label={<Typography variant="body2">{CHARACTERS[gameId][id].name}</Typography>}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
