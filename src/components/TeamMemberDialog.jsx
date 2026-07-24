import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  GlobalStyles,
  IconButton,
  ListItemButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHARACTER, ACTION, WEAPON, SET } from '@/data';
import { toArray, formatStr, getMember, getDefaultWeaponRank, applyStoredBuild } from '@/utils';
import { useBuild } from '@/contexts';

function CharacterSelectDialog({ gameId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(CHARACTER[gameId])
      .filter(([_, { name }]) => name.toLowerCase().includes(lower))
      .map(([id, { name }]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search]);

  const handleSelect = (id) => {
    onSelect(id);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Character
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search characters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/character/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center' }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function WeaponSelectDialog({ gameId, weaponType, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(WEAPON[gameId])
      .filter(([_, w]) =>
        (!weaponType || w.type === weaponType) &&
        w.name.toLowerCase().includes(lower)
      )
      .map(([id, w]) => ({ id, name: w.name, quality: w.quality }))
      .sort((a, b) => Number(b.quality) - Number(a.quality) || a.name.localeCompare(b.name));
  }, [gameId, weaponType, search]);

  const handleSelect = (id) => {
    onSelect(id);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Weapon
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search weapons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/weapon/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center' }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const SetSelectDialog = ({ gameId, open, onClose, onSelect, remainingCapacity }) => {
  const [search, setSearch] = useState('');

  const allTiers = useMemo(() => {
    const tiers = new Set();

    for (const setId in SET[gameId]) {
      const set = SET[gameId][setId];

      for (const tier in set.bonusEffects) {
        tiers.add(Number(tier));
      }
    }

    return [...tiers].sort((a, b) => b - a);
  }, [gameId]);

  // Which tiers are possible given remaining capacity
  const enabledTiers = useMemo(() =>
    new Set(allTiers.filter((t) => t <= remainingCapacity))
  , [allTiers, remainingCapacity]);

  const [tierFilter, setTierFilter] = useState(allTiers[0]);

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(SET[gameId])
      .filter(([_, setData]) => {
        const bonusKeys = Object.keys(setData?.bonusEffects ?? {}).map(Number);
        // Must have at least one bonus tier matching the filter (if set) and within capacity
        const hasMatchingTier = tierFilter
          ? bonusKeys.includes(tierFilter) && enabledTiers.has(tierFilter)
          : bonusKeys.some((k) => enabledTiers.has(k));
        return hasMatchingTier && setData.name.toLowerCase().includes(lower);
      })
      .map(([id, setData]) => ({ id, name: setData.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search, tierFilter, enabledTiers]);

  const handleSelect = (id) => {
    onSelect(id, tierFilter);
    setSearch('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        transition: {
          onExited: () => {
            setSearch('');
            setTierFilter(allTiers[0]);
          }
        }
      }}
    >
      <DialogTitle>
        Select Set
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

      <DialogContent>
        {/* Piece-count filter */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ flexShrink: 0 }}>
            Piece bonus:
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={tierFilter}
            onChange={(_, val) => { if (val !== null) setTierFilter(val); }}
          >
            {allTiers.map((tier) => (
              <ToggleButton
                key={tier}
                value={tier}
                disabled={!enabledTiers.has(tier)}
              >
                {tier}pc
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search sets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/set/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />

                <Typography variant="body2" sx={{ textAlign: 'center', px: 0.5 }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}

          {options.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No sets available.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

function SetIcon({ gameId, setId, pieces, onRemove, onClick, disabled = false }) {
  const [hovered, setHovered] = useState(false);
  const name = SET[gameId]?.[setId]?.name ?? setId;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: 'relative' }}>
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick} disabled={disabled}>
            <CardMedia
              image={`${gameId}/set/${setId}.webp`}
              title={name}
              sx={{ width: 80, height: 80 }}
            />
          </CardActionArea>
        </Card>

        {/* Piece-count badge — bottom-left */}
        <Chip
          label={`${pieces}pc`}
          sx={{
            position: 'absolute',
            bottom: 2,
            left: 2,
            height: 18,
            fontSize: '0.65rem',
            pointerEvents: 'none',
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            '& .MuiChip-label': { px: '4px' },
          }}
        />

        {/* Remove X — top-right, visible on hover */}
        {hovered && !disabled && (
          <IconButton
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 18,
              height: 18,
              '&:hover': { bgcolor: 'error.main', color: '#fff', borderColor: 'error.main' },
            }}
          >
            <CloseIcon sx={{ fontSize: 11 }} />
          </IconButton>
        )}
      </Box>

      <Typography
        variant="caption"
        color={disabled && "textDisabled"}
        noWrap
        sx={{ maxWidth: 80 }}
      >
        {name}
      </Typography>
    </Box>
  );
}

function SetCountsEditor({ gameId, id, setCounts, onChange, disabled = false }) {
  const capacity = (gameId === 'genshin-impact' || gameId === 'wuthering-waves') ? 5 : 6;
  const [dialogOpen, setDialogOpen] = useState(false);
  // Index of the set being replaced; null means we're adding a new one
  const [replacingIndex, setReplacingIndex] = useState(null);

  const entries = Object.entries(setCounts)
    .toSorted((a, b) => SET[gameId][b[0]].version - SET[gameId][a[0]].version);

  const usedPieces = entries.reduce((sum, [, n]) => sum + n, 0);

  const remainingForAdd = capacity - usedPieces;

  // Remaining capacity when replacing a specific slot (free up that slot's pieces first)
  const remainingForReplace = (index) => {
    const freed = Number(entries[index]?.[1] ?? 0);
    return capacity - usedPieces + freed;
  };

  const openAdd = () => {
    if (disabled) return;
    setReplacingIndex(null);
    setDialogOpen(true);
  };

  const openReplace = (index) => {
    if (disabled) return;
    setReplacingIndex(index);
    setDialogOpen(true);
  };

  const handleSelect = (setId, pieces) => {
    const next = { ...setCounts };

    if (replacingIndex !== null) {
      // Remove the old set at that index, add the new one
      const oldSetId = entries[replacingIndex][0];
      delete next[oldSetId];
    }

    next[setId] = pieces;
    onChange(next);
  };

  const handleRemove = (setId) => {
    const next = { ...setCounts };
    delete next[setId];
    onChange(next);
  };

  const currentRemainingCapacity =
    replacingIndex !== null
      ? remainingForReplace(replacingIndex)
      : remainingForAdd;

  if (!id) {
    return (
      <Typography variant="body2" color="textSecondary">
        Select a character to edit set bonuses.
      </Typography>
    );
  }

  return (
    <Stack spacing={0.5}>
      <Typography
        variant="subtitle1"
        color={disabled && "textDisabled"}
      >
        Set Bonuses
      </Typography>

      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {entries.map(([setId, pieces], index) => (
          <SetIcon
            key={setId}
            gameId={gameId}
            setId={setId}
            pieces={pieces}
            disabled={disabled}
            onRemove={disabled ? undefined : () => handleRemove(setId)}
            onClick={disabled ? undefined : () => openReplace(index)}
          />
        ))}

        {/* Add button — only shown when more sets can fit and not disabled */}
        {!disabled && remainingForAdd > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Card
              sx={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                boxShadow: 'none',
                bgcolor: 'transparent',
              }}
            >
              <CardActionArea
                onClick={openAdd}
                sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <AddIcon color="action" />
              </CardActionArea>
            </Card>
            <Typography variant="caption" color="textSecondary">
              Add set
            </Typography>
          </Box>
        )}
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1 }}>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(getMember(gameId, id).setCounts)}
          disabled={disabled}
        >
          Reset Default
        </Button>

        <Button
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => onChange({})}
          disabled={disabled}
        >
          Clear
        </Button>
      </Stack>

      <SetSelectDialog
        gameId={gameId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelect}
        remainingCapacity={currentRemainingCapacity}
      />
    </Stack>
  );
}

const SkillSelectDialog = ({ gameId, characterId, open, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const skillMap = ACTION[gameId][characterId];

  const categories = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return Object.entries(skillMap)
      .map(([category, { name, actions }]) => ({
        category,
        name,
        actions: actions
          .map((action, index) => ({ ...action, ref: `${category}.${index}` }))
          .filter((action) => action.name.toLowerCase().includes(lowerSearch)),
      }));
  }, [search, skillMap]);

  const handleSelect = (actionKey) => {
    onSelect(actionKey);
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
                      {actions.map(({ ref, name, tagged = [], skillType = [] }) => (
                        <ListItemButton
                          key={ref}
                          onClick={() => handleSelect(ref)}
                          disableGutters
                          dense
                          sx={{ px: 0.5 }}
                        >
                          {toArray(skillType).map((type) => (
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
                          ))}

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

function PickerButton({ label, imageUrl, name, onClick, onClear, disabled = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography
        variant="subtitle1"
        color={disabled && "textDisabled"}
      >
        {label}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick} disabled={disabled}>
            {imageUrl ? (
              <CardMedia
                image={imageUrl}
                title={name}
                sx={{ width: 80, height: 80 }}
              />
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ textAlign: 'center' }}
                >
                  None
                </Typography>
              </Box>
            )}
          </CardActionArea>
        </Card>

        {hovered && onClear && !disabled && (name || imageUrl) && (
          <IconButton
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 18,
              height: 18,
              '&:hover': { bgcolor: 'error.main', color: '#fff', borderColor: 'error.main' },
            }}
          >
            <CloseIcon sx={{ fontSize: 11 }} />
          </IconButton>
        )}
      </Box>
      <Typography
        variant="caption"
        color={disabled && "textDisabled"}
        noWrap
        sx={{ maxWidth: 80 }}
      >
        {name ?? '—'}
      </Typography>
    </Box>
  );
}

function SortableRotationItem({ id, actionKey, characterId, gameId, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [category, actionIndex] = actionKey.split('.');
  const index = Number(actionIndex);
  const { name, tagged, skillType } = ACTION[gameId][characterId][category].actions[index];

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
        {toArray(skillType).map((type) => (
          <Chip
            key={type}
            label={formatStr(type)}
            variant="outlined"
            sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: '5px' } }}
          />
        ))}
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

function RotationEditor({ gameId, characterId, rotation, onChange }) {
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

  if (!characterId) {
    return (
      <Typography variant="body2" color="textSecondary">
        Select a character to edit rotation.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2.5 }}>
      {dragging && <GlobalStyles styles={{ '*': { cursor: 'grabbing !important' } }} />}

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Rotation
      </Typography>

      <Box
        sx={{
          maxHeight: 220,
          overflowY: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          scrollbarWidth: 'thin',
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
              {rotation.map((actionKey, index) => (
                <SortableRotationItem
                  key={sortableIds[index]}
                  id={sortableIds[index]}
                  actionKey={actionKey}
                  characterId={characterId}
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

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSkillDialogOpen(true)}
        >
          Add Action
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(CHARACTER[gameId][characterId]?.defaults?.rotation ?? [])}
        >
          Reset Default
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
        characterId={characterId}
        open={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onSelect={(actionKey) => onChange([...rotation, actionKey])}
      />
    </Box>
  );
}

export function TeamMemberDialog({ gameId, member, open, onClose, onSave }) {
  const { characterId } = useParams();
  const allBuilds = useBuild().getBuilds(gameId);

  const [draft, setDraft] = useState(member);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [weaponDialogOpen, setWeaponDialogOpen] = useState(false);

  useEffect(() => setDraft(member), [member]);

  const memberData = CHARACTER[gameId][draft.id];
  const weaponData = WEAPON[gameId]?.[draft.weaponId];
  const weaponType = memberData?.type ?? null;

  // Stored build for the current draft member (only meaningful for teammates)
  const storedBuild = draft.id && draft.id !== characterId
    ? allBuilds[draft.id] ?? null
    : null;
  const isMainCharacter = draft.id === characterId;
  const showToggle = storedBuild !== null;
  const buildLocked = !isMainCharacter && draft.useUserBuild === true;

  const handleCharacterSelect = (charId) => {
    let nextMember = getMember(gameId, charId);
    const nextStoredBuild = allBuilds[charId] ?? null;
    if (nextStoredBuild) {
      nextMember = applyStoredBuild(gameId, nextMember, nextStoredBuild);
    }
    setDraft(nextMember);
  };

  const handleToggleUserBuild = (useUserBuild) => {
    if (useUserBuild && storedBuild) {
      setDraft((prev) => applyStoredBuild(gameId, prev, storedBuild));
    } else {
      setDraft((prev) => {
        const { build: _, ...rest } = prev;
        return { ...rest, useUserBuild: false };
      });
    }
  };

  const handleSave = () => {
    if (isMainCharacter) {
      // Preserve build.equipList for simulation; weapon/rank/setCounts are what-if overrides.
      onSave(draft);
    } else if (draft.useUserBuild && storedBuild) {
      onSave({ ...draft, build: storedBuild });
    } else {
      const { build: _, ...rest } = draft;
      onSave(rest);
    }
    onClose();
  };

  const handleCancel = () => {
    setDraft(member);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configure Team Member
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

        <DialogContent dividers>
          {showToggle && (
            <FormControlLabel
              control={
                <Switch
                  checked={buildLocked}
                  onChange={(e) => handleToggleUserBuild(e.target.checked)}
                />
              }
              label={buildLocked ? 'Using own build' : 'Using trial build'}
              sx={{ mb: 1 }}
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start', mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                {/* Character */}
                <PickerButton
                  label="Character"
                  imageUrl={`${gameId}/character/${draft.id}.webp`}
                  name={memberData?.name ?? null}
                  onClick={() => setCharDialogOpen(true)}
                  onClear={() => setDraft((prev) => ({
                    ...prev,
                    id: null,
                    rank: null,
                    weaponId: null,
                    weaponRank: null,
                    setCounts: {},
                    rotation: [],
                    useUserBuild: false,
                  }))}
                />

                <TextField
                  select
                  value={draft.rank ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, rank: Number(e.target.value) }))}
                  disabled={!draft.id || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
                    <MenuItem key={rank} value={rank}>
                      {`S${rank}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                {/* Weapon */}
                <PickerButton
                  label="Weapon"
                  imageUrl={`${gameId}/weapon/${draft.weaponId}.webp`}
                  name={weaponData?.name ?? null}
                  onClick={() => setWeaponDialogOpen(true)}
                  disabled={!draft.id || buildLocked}
                  onClear={buildLocked ? undefined : () => setDraft((prev) => ({
                    ...prev,
                    weaponId: null,
                    weaponRank: null,
                  }))}
                />

                <TextField
                  select
                  value={draft.weaponRank ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, weaponRank: Number(e.target.value) }))}
                  disabled={!draft.weaponId || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <MenuItem key={`weapon-rank-${rank}`} value={rank}>
                      {`S${rank}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
              <SetCountsEditor
                gameId={gameId}
                id={draft.id}
                setCounts={draft.setCounts}
                onChange={(setCounts) => setDraft((prev) => ({ ...prev, setCounts }))}
                disabled={buildLocked}
              />
            </Box>
          </Stack>

          <RotationEditor
            gameId={gameId}
            characterId={draft.id}
            rotation={draft.rotation}
            onChange={(rotation) => setDraft((prev) => ({ ...prev, rotation }))}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <CharacterSelectDialog
        gameId={gameId}
        open={charDialogOpen}
        onClose={() => setCharDialogOpen(false)}
        onSelect={handleCharacterSelect}
      />

      <WeaponSelectDialog
        gameId={gameId}
        weaponType={weaponType}
        open={weaponDialogOpen}
        onClose={() => setWeaponDialogOpen(false)}
        onSelect={(weaponId) => setDraft((prev) => ({
          ...prev,
          weaponId,
          weaponRank: getDefaultWeaponRank(gameId, weaponId),
        }))}
      />
    </>
  );
}
