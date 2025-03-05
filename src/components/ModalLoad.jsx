import React, { useEffect, useState } from "react";
import { writeBatch, doc, getDoc, setDoc } from "firebase/firestore";
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

const ModalLoad = ({
  uid,
  gameType,
  gameData,
  action,
  setAction,
  setLocalObjs,
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

  const suffix = {
    GI: "uid/",
    HSR: "hsr/uid/",
    WW: "",
    ZZZ: "zzz/uid/"
  };

  const equipTypeToIndexGI = {
    EQUIP_BRACER: 0,
    EQUIP_NECKLACE: 1,
    EQUIP_SHOES: 2,
    EQUIP_RING: 3,
    EQUIP_DRESS: 4,
  };

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
  
    if (action?.type === "load") {
      fetchUserUid();
    }
  }, [action]);
  
  // gi 604379917
  // hsr 602849613
  const fetchPlayerData = async () => {
    const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix[gameType]+gameUid}/`);
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
  };

  const handleNext = async () => {
    if (/^\d{9,10}$/.test(gameUid)) {
      setIsLoading(true);
      await fetchPlayerData();

      if (uid && rememberUid) {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, { [`${gameType}_UID`]: gameUid}, { merge: true });
      }
    } else {
      setError("Invalid uid");
    }
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

  const handleSave = async () => {
    const charBuffer =
      gameType === "GI" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.avatarId.toString();
          const info = templateInfo(gameType);
          const gearList = Array(5).fill(null).map(() => templateGear(gameType));

          // character
          info.characterLevel = charObj.propMap["4001"].val;
          info.characterRank = (charObj.talentIdList?.length ?? 0).toString();
    
          // weapon
          const weaponObj = charObj.equipList[charObj.equipList.length - 1];
          info.weapon = weaponObj.itemId.toString();
          info.weaponLevel = weaponObj.weapon.level.toString();
          info.weaponRank = (Object.values(weaponObj.weapon.affixMap ?? { rank: 0 })[0] + 1).toString();

          // gear
          const setCounts = {};
          const equipListArr = charObj.equipList.slice(0, -1);
          for (const equipObj of equipListArr) {
            const gearIndex = equipTypeToIndexGI[equipObj.flat.equipType];
            const currSet = equipObj.flat.icon.substring(13, 18);
            setCounts[currSet] = (setCounts[currSet] || 0) + 1;
            gearList[gearIndex].mainstat = statKey.MAIN[equipObj.flat.reliquaryMainstat.mainPropId];
            const reliqSubArr = equipObj.flat.reliquarySubstats;
            for (const [subIndex, reliqSubObj] of reliqSubArr.entries()) {
              gearList[gearIndex][subIndex][0] = statKey.SUB[reliqSubObj.appendPropId];
              gearList[gearIndex][subIndex][1] = reliqSubObj.statValue.toString();
            }
          }
          let alreadyTwoPiece = false;
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              info.set[0] = { id: set, bonus: "4" };
              break;
            } else if (setCounts[set] >= 2) {
              if (!alreadyTwoPiece) {
                info.set[0] = { id: set, bonus: "2" };
                alreadyTwoPiece = true;
              } else {
                info.set[1] = { id: set, bonus: "2" };
              }
            }
          }

          // skills
          const skillsArr = Object.values(charObj.skillLevelMap);
          info.skills.basic = skillsArr[0].toString();
          info.skills.skill = skillsArr[1].toString();
          info.skills.ult = skillsArr[2].toString();

          return { id, info, gearList };
        }) :
      gameType === "HSR" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.avatarId.toString();
          const info = templateInfo(gameType);
          const gearList = Array(6).fill(null).map(() => templateGear(gameType));

          // character
          info.characterLevel = charObj.level.toString();
          info.characterRank = (charObj.rank ?? 0).toString();

          // weapon
          const weaponObj = charObj.equipment;
          info.weapon = (weaponObj?.tid ?? "").toString();
          info.weaponLevel = (weaponObj?.level ?? "").toString();
          info.weaponRank = (weaponObj?.rank ?? "").toString();

          // gear
          const setCounts = {};
          const setExtraCounts = {};
          const relicListArr = charObj.relicList;
          for (const relicObj of relicListArr) {
            const gearIndex = relicObj.type - 1;
            const currSet = relicObj._flat.setID.toString();
            if (gearIndex <= 3) {
              setCounts[currSet] = (setCounts[currSet] || 0) + 1;
            } else {
              setExtraCounts[currSet] = (setExtraCounts[currSet] || 0) + 1;
            }
            gearList[gearIndex].mainstat = statKey.MAIN[relicObj._flat.props[0].type];
            const subPropsArr = relicObj._flat.props.slice(1);
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              gearList[gearIndex][subIndex][0] = statKey.SUB[subPropObj.type];
              const ratio = subPropObj.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = ratio === 1 ? 1 : 10;
              gearList[gearIndex][subIndex][1] = (Math.round((subPropObj.value * ratio) * roundAmount) / roundAmount).toString() || "";
            }
          }
          let alreadyTwoPiece = false;
          for (const set in setCounts) {
            if (setCounts[set] >= 4) {
              info.set[0] = { id: set, bonus: "4" };
              break;
            } else if (setCounts[set] >= 2) {
              if (!alreadyTwoPiece) {
                info.set[0] = { id: set, bonus: "2" };
                alreadyTwoPiece = true;
              } else {
                info.set[1] = { id: set, bonus: "2" };
              }
            }
          }
          for (const set in setExtraCounts) {
            if (setExtraCounts[set] === 2) {
              info.setExtra = { id: set, bonus: "2" };
              break;
            }
          }

          // skills
          const skillsArr = charObj.skillTreeList;
          info.skills.basic = skillsArr[0].level.toString();
          info.skills.skill = skillsArr[1].level.toString();
          info.skills.ult = skillsArr[2].level.toString();
          info.skills.talent = skillsArr[3].level.toString();

          return { id, info, gearList };
        }) :
      gameType === "WW" ?
        [] :
      gameType === "ZZZ" &&
        [];

    // update states
    for (const char of charBuffer) {
      if (uid) {
        const batch = writeBatch(db);
        const infoDocRef = doc(db, "users", uid, gameType, char.id);
        batch.set(infoDocRef, char.info, { merge: false });
        for (const [index, gearObj] of char.gearList.entries()) {
          const gearDocRef = doc(db, "users", uid, gameType, char.id, "gearList", index.toString());
          batch.set(gearDocRef, gearObj, { merge: false });
        }
        await batch.commit();
      }

      setLocalObjs((prev) => ({
        ...prev,
        [char.id]: { info: char.info, gearList: char.gearList },
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
    <Modal open={action?.type === "load"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        {!enkaList.length ? (
          <Stack alignItems="center" spacing={2}>
            <Stack>
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
                fullWidth
              />
              <Stack direction="row" alignItems="center">
                <Checkbox
                  onChange={() => setRememberUid(!rememberUid)}
                  checked={rememberUid}
                  size="small"
                  disabled={!uid}
                />
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  Remember UID (requires sign-in)
                </Typography>
              </Stack>
            </Stack>
            <Button
              onClick={handleNext}
              loading={isLoading}
              variant="contained"
            >
              Next
            </Button>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={2}>
            <Stack>
              <Typography variant="subtitle1">
                Select the characters to add.
              </Typography>
              {enkaList.map((avatar, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                >
                  <Checkbox
                    onChange={(e) => handleCheckboxChange(e, index)}
                    checked={selectedAvatars.includes(index)}
                    size="small"
                  />
                  <Typography variant="body2">
                    {CHAR[avatar.avatarId].name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ModalLoad;
