import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MemberCard from './MemberCard';

function SortableMemberCard({ id, member, setMember, allyIds }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          cursor: 'grab',
          py: 0.5,
        }}
      >
        <DragIndicatorIcon sx={{ transform: 'rotate(90deg)' }} />
      </Box>

      <MemberCard
        member={member}
        setMember={setMember}
        allyIds={allyIds}
      />
    </Box>
  );
}

const TeamSetupDialog = ({ team, setTeam, open, onClose }) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [draft, setDraft] = useState(team);
  const [ids, setIds] = useState(() => team.map(() => crypto.randomUUID()));

  const onEnter = () => {
    setDraft(team);
    setIds(team.map(() => crypto.randomUUID()));
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    setDraft((prev) => arrayMove(prev, oldIndex, newIndex));
    setIds((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      slotProps={{ transition: { onEnter } }}
    >
      <DialogTitle>
        Team Setup
      </DialogTitle>

      <DialogContent dividers>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          autoScroll={false}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
            <Stack direction="row" spacing={2}>
              {draft.map((member, index) => (
                <SortableMemberCard
                  key={ids[index]}
                  id={ids[index]}
                  member={member}
                  setMember={(next) => setDraft((prev) => prev.with(index, next))}
                  allyIds={draft.map((member) => member?.id).filter((id) => id && id !== member.id)}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setTeam(draft);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamSetupDialog;
