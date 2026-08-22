import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { WW, CHARACTER } from '@/data';
import { useBuilds, useData } from '@/hooks';
import { formatStr, initMember, getDefaultWeapRank, toArray } from '@/utils';
import {
  WeapAutocomplete,
  SetAutocomplete,
  EchoAutocomplete,
} from '../Autocomplete';
import CharacterSelect from './CharacterSelect';

const SkillSelectDialog = ({ gameId, charId, open, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const { skills } = CHARACTER[gameId][charId];

  const categories = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return Object.entries(skills)
      .map(([category, { name, actions }]) => ({
        category,
        name,
        actions: actions
          .map((action, index) => ({ ...action, ref: `${category}.${index}` }))
          .filter((action) => action.name.toLowerCase().includes(lowerSearch)),
      }));
  }, [search, skills]);

  const handleSelect = (actionRef) => {
    onSelect(actionRef);
    setSearch('');
    onClose();
  };

  const hasMatches = categories.some(({ actions }) => actions.length > 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Select Action
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.disabled',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>


      <Box sx={{ px: 3, mb: 2 }}>
        <TextField
          placeholder="Search actions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      <DialogContent
        dividers
        sx={{
          scrollbarColor: 'rgba(255,255,255,0.18) transparent'
        }}
      >
        {hasMatches ? (
          <Stack spacing={1}>
            {categories.map(({ category, name, actions }) => {
              if (!actions.length) return null;
              return (
                <Accordion
                  key={`${category}:${name}`}
                  disableGutters
                  defaultExpanded
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatStr(`${category}: ${name}`)}
                    </Typography>
                    <Typography variant="body2" color="textDisabled" sx={{ ml: 1 }}>
                      ({actions.length})
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={0.5}>
                      {actions.map(({ ref, name, tagged = [], type = '' }) => (
                        <ListItemButton
                          key={ref}
                          onClick={() => handleSelect(ref)}
                          disableGutters
                          dense
                          sx={{ px: 0.5 }}
                        >
                          <Chip
                            key={type}
                            label={formatStr(type)}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              flexShrink: 0,
                              mr: 0.5,
                              '& .MuiChip-label': { px: '5px' },
                            }}
                          />

                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ flexGrow: 1, minWidth: 0 }}
                          >
                            {name}
                          </Typography>

                          {toArray(tagged).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                flexShrink: 0,
                                mr: 0.5,
                                '& .MuiChip-label': { px: '5px' },
                              }}
                            />
                          ))}
                        </ListItemButton>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No skills available for this character.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

function SortableRotationItem({ id, actionRef, charId, member, gameId, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const allActions = CHARACTER[gameId][charId].skills;

  const [category, actionIndex] = actionRef.split('.');
  const index = Number(actionIndex);
  const { name, tagged, type = '' } = allActions[category].actions[index];

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.5,
        px: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isDragging ? 'action.selected' : 'transparent',
        '&:last-child': { borderBottom: 'none' },
        '& .rotation-delete': { opacity: 0, transition: 'opacity 0.15s' },
        '&:hover .rotation-delete': { opacity: 1 },
      }}
    >
      {/* Drag handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'text.disabled',
          flexShrink: 0,
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18 }} />
      </Box>

      {/* Cast type chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexShrink: 0, width: 100 }}>
        <Chip
          key={type}
          label={formatStr(type)}
          variant="outlined"
          sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: '5px' } }}
        />
      </Box>

      {/* Action name */}
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {name}
      </Typography>

      {/* Tags chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexShrink: 0 }}>
        {toArray(tagged).map((tag) => (
          <Chip
            key={tag}
            label={tag}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              flexShrink: 0,
              '& .MuiChip-label': { px: '5px' },
            }}
          />
        ))}
      </Box>

      {/* Delete — hover only */}
      <IconButton className="rotation-delete" onClick={onRemove} sx={{ flexShrink: 0 }}>
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </Box>
  );
}

const RotationEditor = ({ open, onClose, charId, member, rotation = [], onChange }) => {
  const { gameId } = useParams();
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const sortableIds = useMemo(
    () => rotation.map((key, i) => `${key}__${i}`),
    [rotation],
  );

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const oldIndex = sortableIds.indexOf(active.id);
      const newIndex = sortableIds.indexOf(over.id);
      onChange(arrayMove(rotation, oldIndex, newIndex));
    }
  };

  const removeSkill = (index) => onChange(rotation.filter((_, i) => i !== index));

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          maxHeight: 220,
          overflowY: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
          scrollbarColor: (theme) => `${theme.palette.grey[600]} transparent`,
        }}
      >
        {rotation.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
              {rotation.map((actionRef, index) => (
                <SortableRotationItem
                  key={sortableIds[index]}
                  id={sortableIds[index]}
                  actionRef={actionRef}
                  member={member}
                  charId={charId}
                  gameId={gameId}
                  onRemove={() => removeSkill(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
            Rotation is empty.
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSkillDialogOpen(true)}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(CHARACTER[gameId][charId]?.defaults?.rotation ?? [])}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => onChange([])}
        >
          Clear
        </Button>
      </Stack>

      <SkillSelectDialog
        gameId={gameId}
        charId={charId}
        open={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onSelect={(actionRef) => onChange([...rotation, actionRef])}
      />
    </Dialog>
  );
};

export const MemberConfig = ({ member, onChange }) => {
  const { gameId } = useParams();
  const builds = useBuilds();
  const [characterSelectOpen, setCharacterSelectOpen] = useState(false);
  const [rotationEditorOpen, setRotationEditorOpen] = useState(false);

  const memberData = useData('character')[member.id];
  const weaponType = memberData?.type ?? null;

  return (
    <Card sx={{ width: 340 }}>
      <CardContent component={Stack} spacing={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            '&:hover .member-remove-btn': {
              opacity: 1,
              pointerEvents: 'auto',
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Card sx={{ width: 80 }}>
              <CardActionArea onClick={() => setCharacterSelectOpen(true)}>
                <CardMedia
                  image={memberData?.icon}
                  title={memberData?.name ?? null}
                  sx={{ width: 80, height: 80 }}
                />
              </CardActionArea>
            </Card>

            <IconButton
              className="member-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange({});
              }}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                width: 18,
                height: 18,
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.15s',
                '&:hover': {
                  bgcolor: 'error.main',
                  color: '#fff',
                  borderColor: 'error.main',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 11 }} />
            </IconButton>
          </Box>
          <Typography variant="caption">
            {memberData?.name ?? '—'}
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={member.rank ?? ''}
          onChange={(_, value) => value !== null &&
            onChange({ ...member, rank: value })
          }
          disabled={!member.id}
          exclusive
          fullWidth
        >
          {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
            <ToggleButton key={rank} value={rank}>
              {`S${rank}`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider />

        <Stack spacing={1}>
          <WeapAutocomplete
            gameId={gameId}
            type={weaponType}
            selected={member.weaponId}
            onChange={(weaponId) => onChange({
              ...member,
              weaponId,
              weaponRank: weaponId && getDefaultWeapRank(gameId, weaponId),
            })}
            label="Weapon"
            disabled={!member.id}
            fullWidth
          />

          <ToggleButtonGroup
            value={member.weaponRank ?? ''}
            onChange={(_, value) => value !== null &&
              onChange({ ...member, weaponRank: value })
            }
            disabled={!member.weaponId}
            exclusive
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((rank) => (
              <ToggleButton key={rank} value={rank}>
                {`S${rank}`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <SetAutocomplete
            gameId={gameId}
            setCounts={member.setCounts}
            onChange={(value) => onChange({ ...member, setCounts: value })}
            label="Set Bonuses"
            disabled={!member.id}
          />

          {gameId === WW && (
            <EchoAutocomplete
              sets={Object.keys(member.setCounts)}
              selected={member.mainEcho ?? null}
              onChange={(mainEcho) => onChange({ ...member, mainEcho })}
              label="Main Echo"
              disabled={!member.id}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          {member.id && (
            <Button variant="outlined" onClick={() => setRotationEditorOpen(true)}>
              Edit Rotation
            </Button>
          )}

          {gameId === WW && memberData?.modes && (
            <ToggleButtonGroup
              value={member.mode ?? memberData.modes[0]}
              onChange={(_, value) => {
                if (value !== null) {
                  onChange({ ...member, mode: value });
                }
              }}
              exclusive
            >
              {memberData.modes.map((mode) => (
                <ToggleButton key={mode} value={mode} title={formatStr(mode)}>
                  <img
                    src={`wuthering-waves/mode/${mode}.webp`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Stack>
      </CardContent>

      <CharacterSelect
        open={characterSelectOpen}
        onClose={() => setCharacterSelectOpen(false)}
        onSelect={(id) => onChange(initMember(id, gameId, builds))}
      />

      <RotationEditor
        open={rotationEditorOpen}
        onClose={() => setRotationEditorOpen(false)}
        charId={member.id}
        member={member}
        rotation={member.rotation}
      />
    </Card>
  );
};
