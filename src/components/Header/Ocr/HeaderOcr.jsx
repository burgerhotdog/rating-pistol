import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useBuild, useAuth } from '@/contexts';
import { useOcrWorker } from './useOcrWorker';
import ModeSelectDialog from './ModeSelectDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { createBlankBuild } from './ocrBuildDefaults';
import { WW } from '@/data';

const HeaderOcr = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useAuth();
  const { saveBuildEntries } = useBuild();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingEntry, setPendingEntry] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [batchEntries, setBatchEntries] = useState([]);
  const [batchCursor, setBatchCursor] = useState(0);
  const [confirmedBatchEntries, setConfirmedBatchEntries] = useState([]);

  const uploadInputRef = useRef(null);

  const {
    isLoading: isOcrLoading,
    error,
    batchScanIndex,
    batchScanTotal,
    startFiles,
  } = useOcrWorker({
    onSuccess: (entry) => {
      setPendingEntry(entry);
      setDialogOpen(true);
    },
    onBatchSuccess: (entries) => {
      if (!entries.length) return;
      setConfirmedBatchEntries([]);
      setBatchEntries(entries);
      setBatchCursor(0);
      setPendingEntry(entries[0]);
      setDialogOpen(true);
    },
  });

  const isBatchMode = batchEntries.length > 0;
  const batchTotal = batchEntries.length;
  const batchIndex = isBatchMode ? batchCursor + 1 : 0;

  const isLoading = isOcrLoading || isSaving;
  const showBatchScanProgress = isOcrLoading && batchScanTotal > 1;

  // --- Mode-select dialog handlers ---
  const handleSelectUpload = () => {
    uploadInputRef.current?.click();
  };

  const handleSelectScratch = () => {
    setMenuOpen(false);
    setPendingEntry(['', createBlankBuild()]);
    setDialogOpen(true);
  };

  // --- File input handlers ---
  const handleUploadFilesChange = (e) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    if (!fileList.length) return;
    startFiles(fileList);
  };

  // --- Confirm dialog field editors ---
  const updateTopField = (field, value) => {
    setPendingEntry(([characterId, build]) => [characterId, { ...build, [field]: value }]);
  };

  const updateCharacterId = (value) => {
    setPendingEntry(([, build]) => [value, build]);
  };

  const updateEquip = (index, nextEquip) => {
    setPendingEntry(([characterId, build]) => {
      const equipList = build.equipList.map((eq, i) => (i === index ? nextEquip : eq));
      return [characterId, { ...build, equipList }];
    });
  };

  const advanceBatchConfirm = () => {
    const nextIndex = batchCursor + 1;
    if (nextIndex < batchEntries.length) {
      setBatchCursor(nextIndex);
      setPendingEntry(batchEntries[nextIndex]);
      return;
    }

    setConfirmedBatchEntries([]);
    setBatchEntries([]);
    setBatchCursor(0);
    setPendingEntry(null);
    setDialogOpen(false);
  };

  const finalizeBatchSave = async (entriesToSave) => {
    if (!entriesToSave.length) {
      advanceBatchConfirm();
      return;
    }

    setIsSaving(true);
    try {
      await saveBuildEntries(WW, entriesToSave);
      advanceBatchConfirm();
    } catch (err) {
      console.log(err);
      // surfaced via `error` state below is OCR-specific; report save errors separately
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isBatchMode) {
      if (batchIndex === batchTotal) {
        finalizeBatchSave(confirmedBatchEntries);
        return;
      }
      advanceBatchConfirm();
      return;
    }

    setDialogOpen(false);
    setPendingEntry(null);
  };

  const handleConfirm = async () => {
    if (!pendingEntry) return;
    const [characterId] = pendingEntry;
    if (isBatchMode) {
      const nextConfirmedEntries = [...confirmedBatchEntries, pendingEntry];
      if (batchIndex === batchTotal) {
        await finalizeBatchSave(nextConfirmedEntries);
      } else {
        setConfirmedBatchEntries(nextConfirmedEntries);
        advanceBatchConfirm();
      }
      return;
    }

    setIsSaving(true);
    try {
      await saveBuildEntries(WW, [pendingEntry]);
      setPendingEntry(null);
      setDialogOpen(false);
      navigate(`/${gameId}/${characterId}`, { replace: true });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Button
        onClick={() => setMenuOpen(true)}
        loading={isLoading}
      >
        Upload Image
      </Button>

      <input
        ref={uploadInputRef}
        hidden
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadFilesChange}
      />

      {(showBatchScanProgress || error) && (
        <Box sx={{ position: 'absolute', top: '100%', mt: 1, textAlign: 'center' }}>
          {showBatchScanProgress && (
            <Typography variant="body2" color="textSecondary">
              Running OCR {batchScanIndex} of {batchScanTotal}...
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      )}

      <ModeSelectDialog
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectUpload={handleSelectUpload}
        onSelectScratch={handleSelectScratch}
      />

      <ConfirmDialog
        open={dialogOpen}
        pendingEntry={pendingEntry}
        isLoading={isLoading}
        isBatchMode={isBatchMode}
        batchIndex={batchIndex}
        batchTotal={batchTotal}
        onUpdateCharacterId={updateCharacterId}
        onUpdateTopField={updateTopField}
        onUpdateEquip={updateEquip}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Box>
  );
};

export default HeaderOcr;
