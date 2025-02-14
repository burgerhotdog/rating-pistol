import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

const Enka = ({
  uid,
  isEnkaOpen,
  setIsEnkaOpen,
  myChars,
  setMyChars,
}) => {
  const [error, setError] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  // suffix
  // gi: uid/
  // hsr: hsr/uid/
  // zzz: zzz/uid/
  const suffix = "uid/";
  const tempGameUid = "618285856";
  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix+tempGameUid}/`);
      const data = await response.json();
      setAvatarList(JSON.parse(JSON.stringify(data.avatarInfoList)));
      setError("");
    } catch (error) {
      console.error("Failed to fetch player data:", error);
      setError("Error loading uid");
      setNextButtonDisabled(false);
    }
  };

  const handleNext = async () => {
    console.log(gameUid);
    setNextButtonDisabled(true);
    await fetchPlayerData();
  };

  const handleCancel = () => {
    setError("");
    setGameUid("");
    setAvatarList([]);
    setSelectedAvatars([]);
    setNextButtonDisabled(false);
    setIsEnkaOpen(false);
  };

  const handleSave = () => {
    console.log("Selected avatars:", selectedAvatars);
    // for each avatar in selected avatars
    // create a cid and cdata,
    // copy the data from avatarlist to cid and cdata
    // start with name, weapon, set
    // then do the artifacts
    // if user is logged in, check if the character exists
    // delete it if it does,
    // add the new cid and cdata to documents
    // add the new cid and cdata to the local characters
    // repeat
    //cleanup
    setError("");
    setGameUid("");
    setAvatarList([]);
    setSelectedAvatars([]);
    setNextButtonDisabled(false);
    setIsEnkaOpen(false);
  }

  const handleCheckboxChange = (event, avatarId) => {
    setSelectedAvatars((prevSelectedAvatars) => {
      if (event.target.checked) {
        return [...prevSelectedAvatars, avatarId];
      } else {
        return prevSelectedAvatars.filter((id) => id !== avatarId);
      }
    });
  };

  return (
    <Modal open={Boolean(isEnkaOpen)} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {!avatarList.length ? (
          <React.Fragment>
            <Typography>Enter uid</Typography>
            <TextField
              size="small"
              value={gameUid}
              onChange={(e) => {
                const newValue = e.target.value;
                const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                if (isValidNumber) setGameUid(newValue);
              }}
              sx={{ mt: 1 }}
              error={Boolean(error)} 
              helperText={error}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 2 }}
              disabled={nextButtonDisabled}
            >
              Next
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography>Select which characters to add</Typography>
            {avatarList.map((avatar, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAvatars.includes(avatar.avatarId)}
                      onChange={(e) => handleCheckboxChange(e, avatar.avatarId)}
                    />
                  }
                  label={avatar.avatarId}
                />
              </Box>
            ))}

            <Button
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};

export default Enka;
