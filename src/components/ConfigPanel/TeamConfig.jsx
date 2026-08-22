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
import { MemberConfig } from './MemberConfig';

function SortableMemberConfig({ id, member, onChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <Box
        {...attributes}
        {...listeners}
        sx={{ display: 'flex', justifyContent: 'center', cursor: 'grab', py: 0.5 }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18, transform: 'rotate(90deg)' }} />
      </Box>

      <MemberConfig member={member} onChange={onChange} />
    </Box>
  );
}

export const TeamConfig = ({ open, onClose, team, setTeam }) => {
  const [draft, setDraft] = useState(team);

  const sensors = useSensors(useSensor(PointerSensor));
  const ids = draft.map((member) => member.id);

  const handleCancel = () => {
    setDraft(team);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg">
      <DialogTitle>
        Team Configuration
      </DialogTitle>

      <DialogContent dividers>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          autoScroll={false}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            setDraft((prev) => arrayMove(prev, ids.indexOf(active.id), ids.indexOf(over.id)));
          }}
        >
          <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
            <Stack direction="row" spacing={2}>
              {draft.map((member, index) => (
                <SortableMemberConfig
                  key={member.id}
                  id={member.id}
                  member={member}
                  onChange={(next) => setDraft((prev) => prev.with(index, next))}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>
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
