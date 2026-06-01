import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Divider,
  FormControlLabel,
  GlobalStyles,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHARACTERS, MVS, WEAPONS, SETS, MISC } from '@/data';
import { getMember, formatRotation, getSetCounts } from '@/utils';
import { useBuild } from '@/contexts';

function CharacterSelectDialog({ gameId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(CHARACTERS[gameId])
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
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
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
                <Typography variant="body2" textAlign="center" noWrap>
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
    return Object.entries(WEAPONS[gameId])
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
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search weapons..."
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
                  image={`${gameId}/weapon/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" textAlign="center" noWrap>
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

// ─── SetSelectDialog ────────────────────────────────────────────────────────

function SetSelectDialog({ gameId, open, onClose, onSelect, remainingCapacity }) {
  const [search, setSearch] = useState('');
  const [pieceFilter, setPieceFilter] = useState(null);

  // Collect all piece-count tiers that exist across all sets in this game
  const allPieceTiers = useMemo(() => {
    const tiers = new Set();
    for (const setData of Object.values(SETS[gameId])) {
      for (const key of Object.keys(setData?.setBonus ?? {})) {
        const n = Number(key);
        if (Number.isFinite(n)) tiers.add(n);
      }
    }
    return [...tiers].sort((a, b) => b - a);
  }, [gameId]);

  // Which tiers are possible given remaining capacity
  const enabledTiers = useMemo(
    () => new Set(allPieceTiers.filter(t => t <= remainingCapacity)),
    [allPieceTiers, remainingCapacity]
  );

  // Sync default filter to first enabled tier whenever dialog opens
  useEffect(() => {
    if (open) {
      const firstEnabled = allPieceTiers.find(t => enabledTiers.has(t)) ?? null;
      setPieceFilter(firstEnabled);
    }
  }, [open, allPieceTiers, enabledTiers]);

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(SETS[gameId])
      .filter(([_, setData]) => {
        const bonusKeys = Object.keys(setData?.setBonus ?? {}).map(Number);
        // Must have at least one bonus tier matching the filter (if set) and within capacity
        const hasMatchingTier = pieceFilter
          ? bonusKeys.includes(pieceFilter) && enabledTiers.has(pieceFilter)
          : bonusKeys.some(k => enabledTiers.has(k));
        return hasMatchingTier && setData.name.toLowerCase().includes(lower);
      })
      .map(([id, setData]) => ({ id, name: setData.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search, pieceFilter, enabledTiers]);

  const handleSelect = (id) => {
    onSelect(id, pieceFilter);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Set
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Piece-count filter */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            Piece bonus:
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={pieceFilter}
            onChange={(_, val) => { if (val !== null) setPieceFilter(val); }}
          >
            {allPieceTiers.map(tier => (
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
          size="small"
          placeholder="Search sets..."
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
                  image={`${gameId}/set/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" textAlign="center" noWrap px={0.5}>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}

          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No sets available.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// ─── SetIcon — single icon with hover-X and piece-count badge ───────────────

function SetIcon({ gameId, setId, pieces, onRemove, onClick }) {
  const [hovered, setHovered] = useState(false);
  const name = SETS[gameId]?.[setId]?.name ?? setId;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box position="relative">
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick}>
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
          size="small"
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
        {hovered && (
          <IconButton
            size="small"
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

      <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
        {name}
      </Typography>
    </Box>
  );
}

// ─── SetCountsEditor ────────────────────────────────────────────────────────

function SetCountsEditor({ gameId, memberId, setCounts, onChange, disabled = false }) {
  const capacity = (gameId === 'genshin-impact' || gameId === 'wuthering-waves') ? 5 : 6;
  const [dialogOpen, setDialogOpen] = useState(false);
  // Index of the set being replaced; null means we're adding a new one
  const [replacingIndex, setReplacingIndex] = useState(null);

  const entries = Object.entries(setCounts); // [[setId, pieces], ...]
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
    replacingIndex !== null ? remainingForReplace(replacingIndex) : remainingForAdd;

  if (!memberId) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a character to edit set bonuses.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Set Bonuses
      </Typography>

      <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap" useFlexGap>
        {entries.map(([setId, pieces], index) => (
          <SetIcon
            key={setId}
            gameId={gameId}
            setId={setId}
            pieces={pieces}
            onRemove={disabled ? undefined : () => handleRemove(setId)}
            onClick={disabled ? undefined : () => openReplace(index)}
          />
        ))}

        {/* Add button — only shown when more sets can fit and not disabled */}
        {!disabled && remainingForAdd > 0 && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
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
            <Typography variant="caption" color="text.secondary">Add set</Typography>
          </Box>
        )}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(getMember(gameId, memberId).setCounts)}
          disabled={disabled}
        >
          Reset Default
        </Button>
        <Button
          size="small"
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
    </Box>
  );
}

const SKILL_GROUP_ORDER = ['BA', 'RS', 'FC', 'RL', 'IS', 'OS'];
const SKILL_GROUP_LABELS = {
  BA: 'Normal Attack',
  RS: 'Resonance Skill',
  FC: 'Forte Circuit',
  RL: 'Resonance Liberation',
  IS: 'Intro Skill',
  OS: 'Outro Skill',
};

function SkillSelectDialog({ gameId, characterId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const abilityTypeLabels = MISC[gameId]?.SKILL_TYPES ?? {};

  // Build grouped actions: { skillId: [{ actionKey, name }, ...] }
  const groupedOptions = useMemo(() => {
    if (!characterId || !MVS[gameId]?.[characterId]) return {};
    const skillTree = MVS[gameId][characterId];
    const groups = {};
    for (const [skillId, skillDef] of Object.entries(skillTree)) {
      groups[skillId] = Object.entries(skillDef).map(([actionId, actionDef]) => ({
        actionKey: `${characterId}-${skillId}-${actionId}`,
        name: actionDef.name,
      }));
    }
    return groups;
  }, [gameId, characterId]);

  // Ordered list of skill group keys present for this character
  const skillOrder = useMemo(() => {
    const keys = Object.keys(groupedOptions);
    return [
      ...SKILL_GROUP_ORDER.filter(k => keys.includes(k)),
      ...keys.filter(k => !SKILL_GROUP_ORDER.includes(k)),
    ];
  }, [groupedOptions]);

  // Apply search filter per group
  const filteredGroups = useMemo(() => {
    const lower = search.toLowerCase();
    const result = {};
    for (const skillId of skillOrder) {
      const actions = groupedOptions[skillId] ?? [];
      result[skillId] = lower
        ? actions.filter(({ name }) => name.toLowerCase().includes(lower))
        : actions;
    }
    return result;
  }, [groupedOptions, skillOrder, search]);

  const handleSelect = (actionKey) => {
    onSelect(actionKey);
    setSearch('');
    onClose();
  };

  const totalVisible = skillOrder.reduce((sum, id) => sum + (filteredGroups[id]?.length ?? 0), 0);

  // Split into top row (all except OS) and bottom row (OS only)
  const topIds = skillOrder.filter(id => id !== 'OS');
  const hasOs = skillOrder.includes('OS');

  const renderColumn = (skillId) => {
    const filtered = filteredGroups[skillId] ?? [];
    const total = groupedOptions[skillId]?.length ?? 0;
    const label = SKILL_GROUP_LABELS[skillId] ?? abilityTypeLabels[skillId] ?? skillId;
    return (
      <Box key={skillId}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
          {label}{' '}
          <Typography variant="caption" color="text.disabled" component="span">
            {search ? `(${filtered.length}/${total})` : `(${total})`}
          </Typography>
        </Typography>
        <Stack spacing={0.5}>
          {filtered.map(({ actionKey, name }) => (
            <Button
              key={actionKey}
              variant="outlined"
              size="small"
              onClick={() => handleSelect(actionKey)}
              sx={{ justifyContent: 'flex-start', textTransform: 'none', fontSize: '0.75rem' }}
            >
              {name}
            </Button>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Select Action</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search actions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {totalVisible === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No skills available for this character.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {/* Top row: all groups except OS */}
            {topIds.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${topIds.length}, 1fr)`,
                  gap: 1,
                  alignItems: 'start',
                }}
              >
                {topIds.map(renderColumn)}
              </Box>
            )}

            {/* Bottom row: OS centered at same column width as top grid */}
            {hasOs && (
              <>
                <Divider />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${topIds.length}, 1fr)`,
                  }}
                >
                  <Box sx={{ gridColumn: `${Math.ceil(topIds.length / 2)}` }}>
                    {renderColumn('OS')}
                  </Box>
                </Box>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PickerButton({ label, imageUrl, name, onClick, onClear, disabled = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box position="relative">
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
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  None
                </Typography>
              </Box>
            )}
          </CardActionArea>
        </Card>

        {hovered && onClear && !disabled && (name || imageUrl) && (
          <IconButton
            size="small"
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
      <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
        {name ?? '—'}
      </Typography>
    </Box>
  );
}

// ─── Rotation drag-and-drop helpers ────────────────────────────────────────

function SortableRotationItem({ id, actionKey, gameId, skillTypeLabels, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [ownerId, skillId, actionId] = actionKey.split('-');
  const { cast, name, prefix } = MVS[gameId][ownerId][skillId][actionId];

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

      {/* Action name */}
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {name}
      </Typography>

      {/* Cast type chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexShrink: 0 }}>
        {cast.map(castType => (
          <Chip
            key={castType}
            size="small"
            label={skillTypeLabels[castType] ?? castType}
            variant="outlined"
            sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: '5px' } }}
          />
        ))}
      </Box>

      {/* Prefix badge */}
      {prefix && (
        <Chip
          size="small"
          label={prefix}
          sx={{
            height: 20,
            fontSize: '0.65rem',
            flexShrink: 0,
            '& .MuiChip-label': { px: '6px' },
          }}
        />
      )}

      {/* Delete — hover only */}
      <IconButton className="rotation-delete" size="small" onClick={onRemove} sx={{ flexShrink: 0 }}>
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

function RotationEditor({ gameId, characterId, rotation, onChange }) {
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const skillTypeLabels = MISC[gameId]?.SKILL_TYPES ?? {};

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
      <Typography variant="body2" color="text.secondary">
        Select a character to edit rotation.
      </Typography>
    );
  }

  return (
    <Box mt={2.5}>
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
                  gameId={gameId}
                  skillTypeLabels={skillTypeLabels}
                  onRemove={() => removeSkill(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Rotation is empty.
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSkillDialogOpen(true)}
        >
          Add Action
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(CHARACTERS[gameId][characterId]?.defaults?.rotation ?? [])}
        >
          Reset Default
        </Button>
        <Button
          size="small"
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

  const memberData = CHARACTERS[gameId][draft.memberId];
  const weaponData = WEAPONS[gameId]?.[draft.weaponId];
  const weaponType = memberData?.type ?? null;

  // Stored build for the current draft member (only meaningful for teammates)
  const storedBuild = draft.memberId && draft.memberId !== characterId
    ? allBuilds[draft.memberId] ?? null
    : null;
  const showToggle = storedBuild !== null;
  const buildLocked = draft.useUserBuild === true;

  const getDefaultRank = (memberId) => {
    if (!memberId) return null;
    return CHARACTERS[gameId][memberId]?.quality === '5' ? 0 : 6;
  };

  const getDefaultWeaponRank = (weaponId) => {
    if (!weaponId) return null;
    return WEAPONS[gameId][weaponId]?.quality === '5' ? 1 : 5;
  };

  const handleCharacterSelect = (charId) => {
    const nextMember = getMember(gameId, charId);
    const nextStoredBuild = allBuilds[charId] ?? null;
    const useUserBuild = nextStoredBuild !== null;
    setDraft({
      ...nextMember,
      rank: getDefaultRank(nextMember.memberId),
      weaponRank: getDefaultWeaponRank(nextMember.weaponId),
      useUserBuild,
      ...(useUserBuild ? {
        build: nextStoredBuild,
        weaponId: nextStoredBuild.weaponId,
        setCounts: getSetCounts(nextStoredBuild.equipList),
        weaponRank: nextStoredBuild.weaponRank ?? getDefaultWeaponRank(nextStoredBuild.weaponId),
        rank: nextStoredBuild.rank ?? getDefaultRank(charId),
      } : {}),
    });
  };

  const handleToggleUserBuild = (useUserBuild) => {
    if (useUserBuild && storedBuild) {
      setDraft(prev => ({
        ...prev,
        useUserBuild: true,
        build: storedBuild,
        weaponId: storedBuild.weaponId,
        setCounts: getSetCounts(storedBuild.equipList),
        weaponRank: storedBuild.weaponRank ?? getDefaultWeaponRank(storedBuild.weaponId),
        rank: storedBuild.rank ?? getDefaultRank(prev.memberId),
      }));
    } else {
      setDraft(prev => {
        const { build: _, ...rest } = prev;
        return { ...rest, useUserBuild: false };
      });
    }
  };

  const handleSave = () => {
    if (draft.useUserBuild && storedBuild) {
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

  const rankOptions = [0, 1, 2, 3, 4, 5, 6];
  const weaponRankOptions = [1, 2, 3, 4, 5];

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="md">
        <DialogTitle>Configure Team Member</DialogTitle>

        <DialogContent>
          {showToggle && (
            <FormControlLabel
              control={
                <Switch
                  checked={buildLocked}
                  onChange={(e) => handleToggleUserBuild(e.target.checked)}
                  size="small"
                />
              }
              label={buildLocked ? 'Using my build' : 'What if mode'}
              sx={{ mb: 1 }}
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" mt={1}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Stack spacing={1} alignItems="center">
                {/* Character */}
                <PickerButton
                  label="Character"
                  imageUrl={`${gameId}/character/${draft.memberId}.webp`}
                  name={memberData?.name ?? null}
                  onClick={() => setCharDialogOpen(true)}
                  onClear={() => setDraft(prev => ({
                    ...prev,
                    memberId: null,
                    weaponId: null,
                    setCounts: {},
                    rotation: [],
                    rank: null,
                    weaponRank: null,
                    useUserBuild: false,
                  }))}
                />

                <TextField
                  select
                  size="small"
                  value={draft.rank ?? ''}
                  onChange={(e) => setDraft(prev => ({ ...prev, rank: Number(e.target.value) }))}
                  disabled={!draft.memberId || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {rankOptions.map(rank => (
                    <MenuItem key={rank} value={rank}>
                      {`S${rank}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack spacing={1} alignItems="center">
                {/* Weapon */}
                <PickerButton
                  label="Weapon"
                  imageUrl={`${gameId}/weapon/${draft.weaponId}.webp`}
                  name={weaponData?.name ?? null}
                  onClick={() => setWeaponDialogOpen(true)}
                  disabled={!draft.memberId || buildLocked}
                  onClear={buildLocked ? undefined : () => setDraft(prev => ({
                    ...prev,
                    weaponId: null,
                    weaponRank: null,
                  }))}
                />

                <TextField
                  select
                  size="small"
                  value={draft.weaponRank ?? ''}
                  onChange={(e) => setDraft(prev => ({ ...prev, weaponRank: Number(e.target.value) }))}
                  disabled={!draft.weaponId || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {weaponRankOptions.map(rank => (
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
                memberId={draft.memberId}
                setCounts={draft.setCounts}
                onChange={(setCounts) => setDraft(prev => ({ ...prev, setCounts }))}
                disabled={buildLocked}
              />
            </Box>
          </Stack>

          <RotationEditor
            gameId={gameId}
            characterId={draft.memberId}
            rotation={draft.rotation}
            onChange={(rotation) => setDraft(prev => ({ ...prev, rotation: formatRotation(draft.memberId, rotation) }))}
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
        onSelect={(weaponId) => setDraft(prev => ({
          ...prev,
          weaponId,
          weaponRank: getDefaultWeaponRank(weaponId),
        }))}
      />
    </>
  );
}
