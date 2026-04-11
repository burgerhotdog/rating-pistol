import { useEffect, useRef, useState } from 'react';
import { Button, Box } from '@mui/material';
import { useBuild } from '@/contexts';

const HeaderOcr = () => {
  const { saveBuildEntries } = useBuild();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../workers/ocr/worker.js', import.meta.url),
      { type: 'module' }
    );
    return () => workerRef.current.terminate();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    setIsLoading(true);
    setError(null);

    createImageBitmap(file).then((imageBitmap) => {
      workerRef.current.postMessage({ imageBitmap }, [imageBitmap]);
    });

    workerRef.current.onmessage = ({ data }) => {
      const { success, entry, error: workerError } = data;
      if (!success) {
        setError(workerError);
        setIsLoading(false);
        console.log(data);
        return;
      }

      saveBuildEntries('wuthering-waves', [entry]);
      setError(null);
      setIsLoading(false);
    };

    workerRef.current.onerror = () => {
      setError('Failed to process image. Please try again.');
      setIsLoading(false);
    };
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Button
        component="label"
        loading={isLoading}
      >
        Upload Image
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
};

export default HeaderOcr;
