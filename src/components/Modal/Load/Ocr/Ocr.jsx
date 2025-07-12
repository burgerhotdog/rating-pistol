import { useState } from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import { UploadFile, ImageSearch } from "@mui/icons-material";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

const Ocr = ({ gameId, saveAvatar, closeModal }) => {
  const [uploadedId, setUploadedId] = useState(null);
  const [uploadedData, setUploadedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = (file) => {
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    fetch("https://rating-pistol-be-6a62d70a6b2f.herokuapp.com/ocr/", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(({ id, data }) => {
        setUploadedId(id);
        setUploadedData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setIsLoading(false);
      });
  };

  const handleSave = async () => {
    setIsLoading(true);
    await saveAvatar(uploadedId, uploadedData);
    closeModal();
  };

  if (!uploadedId) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <UploadFile color="primary" />
          <Typography variant="h6">
            Upload Image
          </Typography>
        </Stack>
        <Typography variant="body2">
          This may take a moment.
        </Typography>
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
            hidden
            accept="image/*"
            onChange={(e) => handleImport(e.target.files[0])}
          />
        </Button>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Confirm Import
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            loading="lazy"
            src={AVATAR_ASSETS[gameId][uploadedId]}
            alt={uploadedId}
            sx={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <Typography variant="body2">
            {AVATAR_DATA[gameId][uploadedId].name}
          </Typography>
        </Stack>
      </Box>
      
      <Button onClick={handleSave} loading={isLoading} variant="contained">
        Save
      </Button>
    </Stack>
  );
};

export default Ocr;
