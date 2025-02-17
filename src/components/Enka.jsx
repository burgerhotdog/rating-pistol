import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import blankCdata from "./blankCdata";
import { enkaConvertChar, enkaConvertStats } from "./enkaConvert";
import getScore from "./getScore";

const Enka = ({
  gameType,
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

  const suffix = 
    gameType === "GI"
      ? "uid/"
      : gameType === "HSR"
        ? "hsr/uid/"
        : gameType === "ZZZ"
          ? "zzz/uid/"
          : "";
  const tempGameUid = "618285856";
  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix+gameUid}/`);
      const data = await response.json();
      setAvatarList(JSON.parse(JSON.stringify(data.avatarInfoList)));
      setError("");
    } catch (error) {
      console.error("Error fetching player data", error);
      setError("Error fetching player data");
      setNextButtonDisabled(false);
    }
  };

  const handleNext = async () => {
    if (/^\d{9,10}$/.test(gameUid)) {
      setNextButtonDisabled(true);
      await fetchPlayerData();
    } else {
      setError("Invalid uid");
    }
  };

  const handleCancel = () => {
    setError("");
    setGameUid("");
    setAvatarList([]);
    setSelectedAvatars([]);
    setNextButtonDisabled(false);
    setIsEnkaOpen(false);
  };

  const handleSave = async () => {
    for (const selectedAvatar of selectedAvatars) {
      const cid = enkaConvertChar[avatarList[selectedAvatar].avatarId];
      const cdata = blankCdata(gameType);

      cdata.weapon = avatarList[selectedAvatar].equipList[5].itemId || "";
      const setCounts = {};
      // artifacts
      for (let i = 0; i < 5; i++) {
        cdata.mainstats[i] = enkaConvertStats[avatarList[selectedAvatar].equipList[i].flat.reliquaryMainstat.mainPropId] || "";
        const currSet = (avatarList[selectedAvatar].equipList[i].flat.icon).substring(13, 18);
        console.log(currSet);
        setCounts[currSet] = (setCounts[currSet] || 0) + 1;
        for (let j = 0; j < 4; j++) {
          cdata.substats[i][j][0] = enkaConvertStats[avatarList[selectedAvatar].equipList[i].flat.reliquarySubstats[j].appendPropId] || "";
          cdata.substats[i][j][1] = avatarList[selectedAvatar].equipList[i].flat.reliquarySubstats[j].statValue || "";
        }
      }
      // set
      for (const set in setCounts) {
        if (setCounts[set] >= 4) {
          cdata.set = set;
        }
      }

      // score
      cdata.score = getScore(gameType, cid, cdata);

      console.log(cid);
      console.log(cdata);

      if (myChars[cid]) {
        if (uid) {
          const characterDocRef = doc(db, "users", uid, gameType, cid);
          await deleteDoc(characterDocRef);
        }
        setMyChars((prev) => {
          const updatedChars = { ...prev };
          delete updatedChars[cid];
          return updatedChars;
        });
      }

      if (uid) {
        const charDocRef = doc(db, "users", uid, gameType, cid);
        await setDoc(charDocRef, cdata, { merge: true });
      }
      setMyChars((prev) => ({
        ...prev,
        [cid]: cdata,
      }));
    };

    //cleanup
    setError("");
    setGameUid("");
    setAvatarList([]);
    setSelectedAvatars([]);
    setNextButtonDisabled(false);
    setIsEnkaOpen(false);
  };

  const handleCheckboxChange = (event, index) => {
    setSelectedAvatars((prevSelectedAvatars) => {
      if (event.target.checked) {
        return [...prevSelectedAvatars, index];
      } else {
        return prevSelectedAvatars.filter((id) => id !== index);
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
                const isValidNumber = /^\d*$/.test(newValue);
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
                      checked={selectedAvatars.includes(index)}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                  }
                  label={enkaConvertChar[avatar.avatarId || "error"]}
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
