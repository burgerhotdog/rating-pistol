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
import getScore from "./getScore";
import GAME_DATA from "./gameData";

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
  const [enkaData, setEnkaData] = useState({});
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
  // test uids
  // gi 618285856
  // hsr 602849613
  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix+gameUid}/`);
      const data = await response.json();
      
      switch (gameType) {
        case "GI": {
          const maleToFemale = {
            "10000005-2": "10000007-2", // pyro
            "10000005-3": "10000007-3", // hydro
            "10000005-8": "10000007-8", // dendro
            "10000005-7": "10000007-7", // electro
            "10000005-6": "10000007-6", // geo
            "10000005-4": "10000007-4", // anemo
          };
          for (const avatar of data.avatarInfoList ) {
            if (maleToFemale[avatar.avatarId]) {
              avatar.avatarId = maleToFemale[avatar.avatarId];
            }
          }
        } break;
        case "HSR": {
          const maleToFemale = {
            "8007": "8008", // remembrance
            "8005": "8006", // harmony
            "8003": "8004", // preservation
            "8001": "8002", // destruction
          };
          for (const avatar of data.detailInfo.avatarDetailList ) {
            if (maleToFemale[avatar.avatarId]) {
              avatar.avatarId = maleToFemale[avatar.avatarId];
            }
          }
        } break;
        case "WW": {
          const maleToFemale = {
            "1605": "1604", // havoc
            "1501": "1502", // spectro
          };
        } break;
      }

      setEnkaData(JSON.parse(JSON.stringify(data)));
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
    setEnkaData({});
    setSelectedAvatars([]);
    setNextButtonDisabled(false);
    setIsEnkaOpen(false);
  };

  const handleSave = async () => {
    for (const selectedAvatar of selectedAvatars) {
      const cid = enkaData.avatarInfoList[selectedAvatar].avatarId;
      const cdata = blankCdata(gameType);

      cdata.weapon = enkaData.avatarInfoList[selectedAvatar].equipList[5].itemId || "";
      const setCounts = {};
      // artifacts
      for (let i = 0; i < 5; i++) {
        cdata.mainstats[i] = enkaData.avatarInfoList[selectedAvatar].equipList[i].flat.reliquaryMainstat.mainPropId || "";
        const currSet = (enkaData.avatarInfoList[selectedAvatar].equipList[i].flat.icon).substring(13, 18);
        console.log(currSet);
        setCounts[currSet] = (setCounts[currSet] || 0) + 1;
        for (let j = 0; j < 4; j++) {
          cdata.substats[i][j][0] = enkaData.avatarInfoList[selectedAvatar].equipList[i].flat.reliquarySubstats[j].appendPropId || "";
          cdata.substats[i][j][1] = enkaData.avatarInfoList[selectedAvatar].equipList[i].flat.reliquarySubstats[j].statValue || "";
        }
      }
      // set
      for (const set in setCounts) {
        if (setCounts[set] >= 4) {
          cdata.set = set;
        }
      }


      console.log(cid);
      console.log(cdata);

      // remove previous data if exists
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

      // firestore
      if (uid) {
        const charDocRef = doc(db, "users", uid, gameType, cid);
        await setDoc(charDocRef, cdata, { merge: true });
      }

      // score
      cdata.score = getScore(gameType, cid, cdata);

      // local state
      setMyChars((prev) => ({
        ...prev,
        [cid]: cdata,
      }));
    };

    //cleanup
    setError("");
    setGameUid("");
    setEnkaData({});
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
        {!enkaData.avatarInfoList?.length ? (
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
            {enkaData.avatarInfoList.map((avatar, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAvatars.includes(index)}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                  }
                  label={GAME_DATA[gameType].CHARACTERS[avatar.avatarId]?.name || "error"}
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
