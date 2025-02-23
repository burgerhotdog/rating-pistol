import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
import enkaStatKey from "./enkaStatKey";

const Enka = ({
  uid,
  gameType,
  gameData,
  isEnkaOpen,
  setIsEnkaOpen,
  setMyChars,
}) => {
  const [error, setError] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [enkaList, setEnkaList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberUid, setRememberUid] = useState(false);
  const statKey = enkaStatKey[gameType];

  const suffix = (
    gameType === "GI" ? "uid/" :
    gameType === "HSR" ? "hsr/uid/" :
    gameType === "ZZZ" ? "zzz/uid/" : 
    ""
  );

  useEffect(() => {
    const fetchUserUid = async () => {
      if (!uid) return;
  
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const storedUid = userDoc.data()?.[`${gameType}_UID`];
        if (storedUid) {
          setGameUid(storedUid);
          setRememberUid(true);
        }
      }
    };
  
    if (isEnkaOpen) {
      fetchUserUid();
    }
  }, [isEnkaOpen]);
  
  // gi 604379917
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

          setEnkaList(data.avatarInfoList);
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

          setEnkaList(data.detailInfo.avatarDetailList);
        } break;

        case "ZZZ": {
          // setEnkaList(data);
        } break;

        case "WW": {
          const maleToFemale = {
            "1605": "1604", // havoc
            "1501": "1502", // spectro
          };

          // setEnkaList(data);
        } break;
      }

      setError("");
    } catch (error) {
      console.error("Error fetching player data", error);
      setError("Error fetching player data");
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (/^\d{9,10}$/.test(gameUid)) {
      setIsLoading(true);
      await fetchPlayerData();

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { [`${gameType}_UID`]: rememberUid ? gameUid : "" }, { merge: true });
    } else {
      setError("Invalid uid");
    }
  };

  const handleCancel = () => {
    setError("");
    setGameUid("");
    setEnkaList([]);
    setSelectedAvatars([]);
    setIsLoading(false);
    setRememberUid(false);
    setIsEnkaOpen(false);
  };

  const handleSave = async () => {
    let charBuffer = [];
    switch (gameType) {
      case "GI":
        charBuffer = selectedAvatars.map((selectedAvatar) => {
          const cid = enkaList[selectedAvatar].avatarId.toString();
          const cdata = blankCdata("GI");
    
          cdata.weapon = enkaList[selectedAvatar].equipList[5]?.itemId || "";
          const setCounts = {};
    
          // pieces
          for (let i = 0; i < 5; i++) {
            const currPiece = enkaList[selectedAvatar].equipList[i];
            if (!currPiece) continue;
    
            const currSet = currPiece.flat.icon.substring(13, 18) || "";
            setCounts[currSet] = (setCounts[currSet] || 0) + 1;
    
            cdata.mainstats[i] = statKey.MAIN[currPiece.flat.reliquaryMainstat.mainPropId] || "";
            for (let j = 0; j < 4; j++) {
              cdata.substats[i][j][0] = statKey.SUB[currPiece.flat.reliquarySubstats[j]?.appendPropId] || "";
              cdata.substats[i][j][1] = currPiece.flat.reliquarySubstats[j]?.statValue.toString() || "";
            }
          }
    
          // set
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              cdata.set1 = set;
              break;
            }
          }
    
          return { cid, cdata };
        });
        break;

      case "HSR":
        charBuffer = selectedAvatars.map((selectedAvatar) => {
          const cid = enkaList[selectedAvatar].avatarId.toString();
          const cdata = blankCdata("HSR");
  
          cdata.weapon = enkaList[selectedAvatar].equipment?.tid.toString() || "";
          const setCounts = {};
  
          // pieces
          for (let i = 0; i < 6; i++) {
            const currPiece = enkaList[selectedAvatar].relicList[i];
            if (!currPiece) continue;
  
            const currSet = currPiece._flat.setID.toString() || "";
            setCounts[currSet] = (setCounts[currSet] || 0) + 1;
  
            cdata.mainstats[i] = statKey.MAIN[currPiece._flat.props[0].type] || "";
            for (let j = 0; j < 4; j++) {
              cdata.substats[i][j][0] = statKey.SUB[currPiece._flat.props[j + 1]?.type] || "";
              const ratio = currPiece._flat.props[j + 1]?.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = ratio === 1 ? 1 : 10;
              cdata.substats[i][j][1] = (Math.round((currPiece._flat.props[j + 1]?.value * ratio) * roundAmount) / roundAmount).toString() || "";
            }
          }
  
          // set
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              cdata.set1 = set;
            } else if (setCounts[set] == 2) {
              cdata.set2 = set;
            }
          }

          return { cid, cdata };
        });
        break;
        
      case "ZZZ":
        break;
      
      case "WW":
        break;
    }

    // update states
    for (const char of charBuffer) {
      // firestore
      if (uid) {
        const charDocRef = doc(db, "users", uid, gameType, char.cid);
        await setDoc(charDocRef, char.cdata, { merge: false });
      }

      // local
      setMyChars((prev) => ({
        ...prev,
        [char.cid]: char.cdata,
      }));
    }

    // cleanup
    setError("");
    setSelectedAvatars([]);
    setEnkaList([]);
    setIsLoading(false);
    setGameUid("");
    setRememberUid(false);
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
        {!enkaList.length ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>Enter UID</Typography>
            <TextField
              size="small"
              value={gameUid}
              onChange={(e) => {
                const newValue = e.target.value;
                const isValidNumber = /^\d*$/.test(newValue);
                if (isValidNumber) setGameUid(newValue);
              }}
              error={Boolean(error)}
              helperText={error}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberUid}
                  onChange={() => setRememberUid(!rememberUid)}
                />
              }
              label={<Typography variant="body2">Save this UID (Sign-in required)</Typography>}
            />
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ alignSelf: "start" }}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Next"}
            </Button>
          </Box>
        ) : (
          <React.Fragment>
            <Typography>Select which characters to add</Typography>
            {enkaList.map((avatar, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAvatars.includes(index)}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                  }
                  label={gameData.CHAR[avatar.avatarId]?.name || "error"}
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
