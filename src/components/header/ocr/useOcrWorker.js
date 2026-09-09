import { useRef, useState } from 'react';

export function useOcrWorker({ onSuccess, onBatchSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchScanIndex, setBatchScanIndex] = useState(0);
  const [batchScanTotal, setBatchScanTotal] = useState(0);

  const workerRef = useRef(null);

  const runOcr = async (file) => {
    const imageBitmap = await createImageBitmap(file);

    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../../../workers/ocr/worker.js', import.meta.url),
        { type: 'module' }
      );
    }

    const worker = workerRef.current;

    const { success, entry } = await new Promise((resolve, reject) => {
      worker.onmessage = ({ data }) => resolve(data);
      worker.onerror = () => reject(new Error('OCR failed.'));
      worker.postMessage({ imageBitmap }, [imageBitmap]);
    });

    if (!success) {
      throw new Error('Failed to process image. Please try again.');
    }

    return entry;
  };

  const startFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setIsLoading(true);
    setError(null);
    setBatchScanIndex(0);
    setBatchScanTotal(0);

    if (files.length === 1) {
      try {
        const entry = await runOcr(files[0]);
        onSuccess(entry);
      } catch (err) {
        setError(err?.message || 'Failed to process image. Please try again.');
      } finally {
        setIsLoading(false);
      }

      return;
    }

    const batchEntries = [];
    setBatchScanTotal(files.length);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setBatchScanIndex(i + 1);
      try {
        const entry = await runOcr(file);
        batchEntries.push(entry);
      } catch (err) {
        setError(err?.message || 'Failed to process image. Please try again.');
      }
    }

    setBatchScanIndex(0);
    setBatchScanTotal(0);

    if (batchEntries.length === 1) {
      onSuccess(batchEntries[0]);
    } else if (batchEntries.length > 1) {
      onBatchSuccess(batchEntries);
    }

    setIsLoading(false);
  };

  const terminate = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
  };

  return {
    isLoading,
    error,
    setError,
    batchScanIndex,
    batchScanTotal,
    startFiles,
    terminate,
  };
}
