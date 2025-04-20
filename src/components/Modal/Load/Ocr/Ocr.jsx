import { useState, useCallback, useEffect } from "react";
import { Stack, Typography, Button, Checkbox, FormControlLabel, Box } from "@mui/material";
import { UploadFile, ImageSearch } from "@mui/icons-material";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

const Ocr = ({ gameId, userId, setAvatarCache, saveAvatar, closeModal }) => {
  const [rawFileList, setRawFileList] = useState([]);
  const [importedIds, setImportedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImport = (files) => {
    if (!files.length) return;
    setIsLoading(true);
  
    const readers = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(readers).then((results) => {
      setRawFileList(results);
    });
  };

  const loadImage = (dataUrl) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  
  const cropImage = (img, crop) => {
    const canvas = document.createElement("canvas");
    const width = crop.x2 - crop.x1;
    const height = crop.y2 - crop.y1;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      crop.x1,
      crop.y1,
      width,
      height,
      0,
      0,
      width,
      height,
    );
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );
  };
  
  const sendToOCRSpace = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");
  
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { "apikey": import.meta.env.VITE_OCR_KEY },
      body: formData,
    });
  
    const data = await res.json();
    const text = data?.ParsedResults?.[0]?.ParsedText;
    const firstLine = text?.split(/\r?\n/)[0]; // handles both \n and \r\n
    return firstLine || "";
  };

  useEffect(() => {
    if (!rawFileList.length) return;
  
    const processImages = async () => {
      const newImportedIds = [];
  
      for (const dataUrl of rawFileList) {
        try {
          // 1. Create an <img> element from the Data URL
          const img = await loadImage(dataUrl);
  
          // 2. Crop the image
          const croppedBlob = await cropImage(img, { x1: 63, y1: 0, x2: 760, y2: 90 });

          // 3. Send to ocr.space API
          const text = await sendToOCRSpace(croppedBlob);
  
          // 4. Push the parsed text to the result array
          const newId = Object.entries(AVATAR_DATA[gameId])
            .find(([_, { name }]) => name === text)?.[0];
          if (!newId) throw new Error(`No match found for "${text}"`);
          newImportedIds.push([newId, false]);
        } catch (err) {
          console.error("Error processing image:", err);
          newImportedIds.push(["", false]); // optional: placeholder for failed OCR
        }
      }
  
      setImportedIds(newImportedIds);
      setIsLoading(false);
    };
  
    processImages();
  }, [rawFileList]);

  const handleCheckbox = (index, newChecked) =>
    setImportedIds((prev) =>
      prev.map(([id, isChecked], i) =>
        i === index
          ? [id, newChecked]
          : [id, isChecked]
      )
    );

  if (!importedIds.length) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <UploadFile color="primary" />
          <Typography variant="h6">
            Upload Image
          </Typography>
        </Stack>
        <Button
          variant="contained"
          loading={isLoading}
          component="label"
          fullWidth
          startIcon={<ImageSearch />}
        >
          Select Image
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={(e) => handleImport(e.target.files)}
          />
        </Button>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack>
        <Typography variant="subtitle1">
          Select characters to add.
        </Typography>
        {importedIds.map(([id, isChecked], index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                onChange={(e) => handleCheckbox(index, e.target.checked)}
                checked={isChecked}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  loading="lazy"
                  src={AVATAR_ASSETS[gameId][id]}
                  alt={id}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />
                <Typography variant="body2">
                  {AVATAR_DATA[gameId][id].name}
                </Typography>
              </Stack>
            }
            onClick={(e) => e.stopPropagation()}
          />
        ))}
      </Stack>
      
      <Button onClick={closeModal} loading={isLoading} variant="contained">
        Save
      </Button>
    </Stack>
  );
};

export default Ocr;
