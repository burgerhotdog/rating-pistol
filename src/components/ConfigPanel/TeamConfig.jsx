import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GlobalStyles,
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      {/* Drag handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'text.disabled',
          py: 0.5,
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18, transform: 'rotate(90deg)' }} />
      </Box>

      <MemberConfig member={member} onChange={onChange} />
    </Box>
  );
}

export const TeamConfig = ({ team, open, onClose, onSave }) => {
  const [draft, setDraft] = useState(team);
  const [dragging, setDragging] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));
  const ids = draft.map((member) => member.id);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setDraft((prev) => arrayMove(prev, ids.indexOf(active.id), ids.indexOf(over.id)));
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

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
        {dragging && <GlobalStyles styles={{ '*': { cursor: 'grabbing !important' } }} />}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          autoScroll={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setDragging(false)}
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
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
