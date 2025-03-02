import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { templateInfo, templateGear } from "./template";
import enkaStatKey from "./enkaStatKey";

const LoadModal = ({
  uid,
  gameType,
  gameData,
  setLocalCollection,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR } = gameData;
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
  
    if (action?.e === "load") {
      fetchUserUid();
    }
  }, [action]);
  
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

  const handleSave = async () => {
    const charBuffer =
      gameType === "GI" ?
        selectedAvatars.map((selectedAvatar) => {
          const id = enkaList[selectedAvatar].avatarId.toString();
          const info = templateInfo(gameType);
          const gear = {
            0: templateGear(gameType),
            1: templateGear(gameType),
            2: templateGear(gameType),
            3: templateGear(gameType),
            4: templateGear(gameType),
          };
    
          info.weapon = enkaList[selectedAvatar].equipList[5]?.itemId || "";
          const setCounts = {};
    
          // pieces
          for (let i = 0; i < 5; i++) {
            const currPiece = enkaList[selectedAvatar].equipList[i];
            if (!currPiece) continue;
    
            const currSet = currPiece.flat.icon.substring(13, 18) || "";
            setCounts[currSet] = (setCounts[currSet] || 0) + 1;
    
            gear[i].mainstat = statKey.MAIN[currPiece.flat.reliquaryMainstat.mainPropId] || "";
            for (let j = 0; j < 4; j++) {
              gear[i][j][0] = statKey.SUB[currPiece.flat.reliquarySubstats[j]?.appendPropId] || "";
              gear[i][j][1] = currPiece.flat.reliquarySubstats[j]?.statValue.toString() || "";
            }
          }
    
          // set
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              info.set[0] = set;
              break;
            }
          }
    
          return { id, data: { info, gear } };
        }) :
      gameType === "HSR" ?
        selectedAvatars.map((selectedAvatar) => {
          const id = enkaList[selectedAvatar].avatarId.toString();
          const info = templateInfo(gameType);
          const gear = {
            0: templateGear(gameType),
            1: templateGear(gameType),
            2: templateGear(gameType),
            3: templateGear(gameType),
            4: templateGear(gameType),
            5: templateGear(gameType),
          };

          info.weapon = enkaList[selectedAvatar].equipment?.tid.toString() || "";
          const setCounts = {};

          // pieces
          for (let i = 0; i < 6; i++) {
            const currPiece = enkaList[selectedAvatar].relicList[i];
            if (!currPiece) continue;

            const currSet = currPiece._flat.setID.toString() || "";
            setCounts[currSet] = (setCounts[currSet] || 0) + 1;

            gear[i].mainstat = statKey.MAIN[currPiece._flat.props[0].type] || "";
            for (let j = 0; j < 4; j++) {
              gear[i][j][0] = statKey.SUB[currPiece._flat.props[j + 1]?.type] || "";
              const ratio = currPiece._flat.props[j + 1]?.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = ratio === 1 ? 1 : 10;
              gear[i][j][1] = (Math.round((currPiece._flat.props[j + 1]?.value * ratio) * roundAmount) / roundAmount).toString() || "";
            }
          }

          // set
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              info.set[0] = set;
            } else if (setCounts[set] == 2) {
              info.set[0] = set;
            }
          }

          return { id, data: { info, gear } };
        }) :
      gameType === "WW" ?
        [] :
      gameType === "ZZZ" &&
        [];

    // update states
    for (const char of charBuffer) {
      // firestore
      if (uid) {
        const infoDocRef = doc(db, "users", uid, gameType, char?.id);
        const gearDocRef = doc(db, "users", uid, gameType, char?.id, "gear");
        await setDoc(infoDocRef, char?.data?.info, { merge: false });
        await setDoc(gearDocRef, char?.data?.gear, { merge: false });
      }

      // local
      setLocalCollection((prev) => ({
        ...prev,
        [char?.id]: char?.data,
      }));
    }

    // cleanup
    setError("");
    setSelectedAvatars([]);
    setEnkaList([]);
    setIsLoading(false);
    setGameUid("");
    setRememberUid(false);
    setAction({});
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

  const handleCancel = () => {
    setError("");
    setGameUid("");
    setEnkaList([]);
    setSelectedAvatars([]);
    setIsLoading(false);
    setRememberUid(false);
    setAction({});
  };

  return (
    <Modal open={action?.e === "load"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        {!enkaList.length ? (
          <Stack gap={2}>
            <TextField
              label="Enter UID"
              size="small"
              value={gameUid}
              onChange={(e) => {
                const newValue = e.target.value;
                const isValidNumber = /^\d*$/.test(newValue);
                if (isValidNumber) setGameUid(newValue);
              }}
              error={Boolean(error)}
              helperText={error}
              sx={{ width: 256 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  label="test"
                  size="small"
                  checked={rememberUid}
                  onChange={() => setRememberUid(!rememberUid)}
                  disabled={!uid}
                />
              }
              label={"Remember UID (requires sign-in)"}
              sx={{ my: -1 }}
            />
            <Button
              variant="contained"
              onClick={handleNext}
              loading={isLoading}
              sx={{ width: 80 }}
            >
              Next
            </Button>
          </Stack>
        ) : (
          <Stack gap={2}>
            <Typography>Select characters to add</Typography>
            {enkaList.map((avatar, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedAvatars.includes(index)}
                    onChange={(e) => handleCheckboxChange(e, index)}
                  />
                }
                label={CHAR[avatar.avatarId]?.name || "error"}
                sx={{ my: -1 }}
              />
            ))}

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default LoadModal;
