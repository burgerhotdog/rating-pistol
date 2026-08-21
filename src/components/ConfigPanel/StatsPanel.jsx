import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  GlobalStyles,
  IconButton,
  ListItemButton,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CharAvatar } from '@/components';
import { CHARACTER } from '@/data';
import { useElementColors, useCharData } from '@/hooks';
import { toArray, formatStr } from '@/utils';
import { TeamConfig } from './TeamConfig';
import { MenuAttrs } from './MenuAttrs';

function getRelativeTime(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

function formatFullDate(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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
          scrollbarColor: 'rgba(255,255,255,0.18) transparent',
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.18)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.32)',
          },
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

function RotationEditor({ gameId, charId, member, rotation = [], onChange }) {
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sortableIds = useMemo(
    () => rotation.map((key, i) => `${key}__${i}`),
    [rotation],
  );

  const handleDragEnd = ({ active, over }) => {
    setDragging(false);
    if (over && active.id !== over.id) {
      const oldIndex = sortableIds.indexOf(active.id);
      const newIndex = sortableIds.indexOf(over.id);
      onChange(arrayMove(rotation, oldIndex, newIndex));
    }
  };

  const removeSkill = (index) => {
    onChange(rotation.filter((_, i) => i !== index));
  };

  if (!charId) {
    return (
      <Typography variant="body2" color="textSecondary">
        Select a character to edit rotation.
      </Typography>
    );
  }

  return (
    <Box>
      {dragging && <GlobalStyles styles={{ '*': { cursor: 'grabbing !important' } }} />}

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
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setDragging(false)}
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
    </Box>
  );
}

export const StatsPanel = ({ team = [], updateTeam }) => {
  const { gameId, charId } = useParams();
  const color = useElementColors({ char: '$curr' });
  const charData = useCharData();
  const [rotationMemberId, setRotationMemberId] = useState(charId);
  const [prevCharId, setPrevCharId] = useState(charId);
  const [teamConfigOpen, setTeamConfigOpen] = useState(false);

  const member = team.find((member) => member.id === charId);
  if (!charId || !member) return (
    <Card sx={{ width: 300 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
      />
    </Card>
  );

  if (prevCharId !== charId) {
    setPrevCharId(charId);
    setRotationMemberId(charId);
  }
  const rotationMemberIndex = Math.max(0, team.findIndex((m) => m.id === rotationMemberId));

  const currChar = charData[charId];

  return (
    <Card sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<CharAvatar gameId={gameId} charId={charId} />}
        title={currChar?.name ?? ''}
        subheader={
          <Stack direction="row" spacing={0.5}>
            <Chip
              variant="outlined"
              label={formatStr(currChar.element)}
              sx={{ fontWeight: 'bold', color }}
            />

            <Chip
              variant="outlined"
              label={formatStr(currChar?.type)}
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        }
      />

      <CardContent component={Stack} spacing={1} sx={{ flex: 1 }}>
        <MenuAttrs team={team} />

        <Divider />

        <Stack>
          <Typography variant="caption" color="textSecondary">
            Team Configuration
          </Typography>

          <IconButton
            onClick={() => setTeamConfigOpen(true)}
            sx={{ justifyContent: 'center', p: 1, borderRadius: 1 }}
          >
            <Stack direction="row" spacing={1}>
              {team.map((member, index) => (
                <Box key={index}>
                  <CharAvatar
                    gameId={gameId}
                    charId={member?.id ?? null}
                  />
                </Box>
              ))}
            </Stack>
          </IconButton>

          <TeamConfig
            team={team}
            open={teamConfigOpen}
            onClose={() => setTeamConfigOpen(false)}
            onSave={updateTeam}
          />
        </Stack>

        <Divider />

        <Stack>
          <Typography variant="caption" color="textSecondary">
            Rotation
          </Typography>

          <TextField
            select
            size="small"
            value={rotationMemberIndex >= 0 ? rotationMemberIndex : 0}
            onChange={(e) => setRotationMemberId(team[Number(e.target.value)]?.id ?? null)}
            fullWidth
          >
            {team.map((m, i) => (
              <MenuItem key={i} value={i} disabled={!m.id}>
                {m.id ? (charData[m.id]?.name ?? m.id) : `Slot ${i + 1} (empty)`}
              </MenuItem>
            ))}
          </TextField>

          {(() => {
            const idx = rotationMemberIndex;
            const rotMember = team[idx];
            return (
              <RotationEditor
                gameId={gameId}
                charId={rotMember?.id ?? null}
                member={rotMember}
                rotation={rotMember?.rotation ?? []}
                onChange={(rotation) => updateTeam((prev) => prev.with(idx, { ...rotMember, rotation }))}
              />
            );
          })()}
        </Stack>

        <Divider />

        <Tooltip title={formatFullDate(member.build?.lastUpdated)}>
          <Typography variant="caption" color="textSecondary">
            Last updated {getRelativeTime(member.build?.lastUpdated)}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};
