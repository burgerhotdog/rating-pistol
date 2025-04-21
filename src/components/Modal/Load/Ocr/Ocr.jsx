import { useState, useEffect } from "react";
import { Stack, Typography, Button, Checkbox, FormControlLabel, Box } from "@mui/material";
import { UploadFile, ImageSearch } from "@mui/icons-material";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";
import combineImages from "./combineImages";
import CROP from "./crop.json";
import { template } from "@config/template";

const loadImage = (dataUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  
const cropImage = (img, crop) => {
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
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
  return text || "";
};

const Ocr = ({ gameId, userId, setAvatarCache, saveAvatar, saveAvatarBatch, closeModal }) => {
  const [rawFileList, setRawFileList] = useState([]);
  const [importedIds, setImportedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (!rawFileList.length) return;
  
    const processImages = async () => {
      const croppedImages = [];
      for (const dataUrl of rawFileList) {
        const img = await loadImage(dataUrl);
        const croppedBlob = await cropImage(img, CROP.avatar);
        croppedImages.push(croppedBlob);
      }

      const newImportedIds = [];
      if (croppedImages.length) {
        try {
          const combinedBlob = await combineImages(croppedImages);
          const ocrText = await sendToOCRSpace(combinedBlob);
          console.log(ocrText);
          
          const allLines = ocrText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
            
          const nameLines = [];
          const otherLines = [];
          
          allLines.forEach((line, index) => {
            if (index % 2 === 0) {
              nameLines.push(line);
            } else {
              otherLines.push(line);
            }
          });
          
          for (const [index, text] of nameLines.entries()) {
            try {
              const newId = Object.entries(AVATAR_DATA[gameId])
                .find(([_, { name }]) => name === text)?.[0];
              if (!newId) throw new Error(`No match found for "${text}"`);

              const newLevel = parseInt(otherLines[index].match(/\d+/)?.[0] || "1");
              newImportedIds.push([newId, newLevel, false]);
            } catch (err) {
              console.error("No matching id found for:", err);
            }
          }
        } catch (err) {
          console.error("Error combining or sending to OCR:", err);
          newImportedIds.push(["", 1, false]);
        }
      }
      if (newImportedIds.length) setImportedIds(newImportedIds);
      setIsLoading(false);
    };
  
    processImages();
  }, [rawFileList]);

  const handleCheckbox = (index, newChecked) =>
    setImportedIds((prev) =>
      prev.map(([id, level, isChecked], i) =>
        i === index 
          ? [id, level, newChecked]
          : [id, level, isChecked]
      )
    );

  const handleSave = () => {
    const selectedIds = importedIds.filter(([_, __, isChecked]) => isChecked);
    const processImages = async () => {
      const croppedImages = [];
      for (const dataUrl of rawFileList) {
        const img = await loadImage(dataUrl);
        const croppedBlob = await cropImage(img, CROP.avatar);
        croppedImages.push(croppedBlob);
      }

      const newImportedIds = [];
      if (croppedImages.length) {
        try {
          const combinedBlob = await combineImages(croppedImages);
          const ocrText = await sendToOCRSpace(combinedBlob);
          console.log(ocrText);
          
          const allLines = ocrText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
            
          const nameLines = [];
          const otherLines = [];
          
          allLines.forEach((line, index) => {
            if (index % 2 === 0) {
              nameLines.push(line);
            } else {
              otherLines.push(line);
            }
          });
          
          for (const [index, text] of nameLines.entries()) {
            try {
              const newId = Object.entries(AVATAR_DATA[gameId])
                .find(([_, { name }]) => name === text)?.[0];
              if (!newId) throw new Error(`No match found for "${text}"`);

              const newLevel = parseInt(otherLines[index].match(/\d+/)?.[0] || "1");
              newImportedIds.push([newId, newLevel, false]);
            } catch (err) {
              console.error("No matching id found for:", err);
            }
          }
        } catch (err) {
          console.error("Error combining or sending to OCR:", err);
          newImportedIds.push(["", 1, false]);
        }
      }
      if (newImportedIds.length) setImportedIds(newImportedIds);
      setIsLoading(false);
    };
    const selectedImageData = rawFileList
      .filter((_, index) => importedIds[index][2])
      .map(dataUrl => {
        const img = await loadImage(dataUrl);
        const croppedBlob = await cropImage(img, CROP.avatar);
        croppedImages.push(croppedBlob);

      });

    const charBuffer = selectedIds
      .map(([id, level]) => {
        const data = template(gameId);
        data.level = level;


        return [id, data];
      });

    console.log(charBuffer);
    return;
  };

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
        {importedIds.map(([id, level, isChecked], index) => (
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
                <Typography variant="body2" color="text.secondary">
                  {`(lvl ${level})`}
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
