import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import template from "../../template";
import getData from "../../getData";
import translate from "./translate";

const ModalLoad = ({
  gameId,
  userId,
  action,
  setAction,
  setLocalDocs,
}) => {
  const theme = useTheme();
  const { avatarData } = getData(gameId);
  const [error, setError] = useState(false);
  const [uid, setUid] = useState(null);
  const [rememberUid, setRememberUid] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const statKey = translate(gameId);

  const suffix = {
    gi: "uid/",
    hsr: "hsr/uid/",
    ww: "",
    zzz: "zzz/uid/"
  };

  useEffect(() => {
    const fetchUid = async () => {
      if (!userId) return;
  
      const userRef = doc(db, "users", userId);
      const userdoc = await getDoc(userRef);
  
      if (userdoc.exists()) {
        const newUid = userdoc.data()?.[`${gameId}_uid`];
        if (newUid) {
          setUid(newUid);
          setRememberUid(true);
        } else {
          setUid(null);
          setRememberUid(false);
        }
      }
    };
  
    if (action?.type === "load") {
      fetchUid();
    }
  }, [action]);
  
  // gi 604379917
  // hsr 602849613
  const fetchPlayerData = async () => {
    const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix[gameId]+uid}/`);
    const rawEnka = await response.json();
    const { maleToFemale } = translate(gameId);
    
    switch (gameId) {
      case "gi":
        for (const rawItem of rawEnka.avatarInfoList) {
          if (maleToFemale[rawItem.avatarId]) {
            rawItem.avatarId = maleToFemale[rawItem.avatarId];
          }
        }
        setEnkaList(rawEnka.avatarInfoList);
      break;

      case "hsr":
        for (const rawItem of rawEnka.detailInfo.avatarDetailList ) {
          if (maleToFemale[rawItem.avatarId]) {
            rawItem.avatarId = maleToFemale[rawItem.avatarId];
          }
        }

        setEnkaList(rawEnka.detailInfo.avatarDetailList);
      break;
    }
    setError(false);
  };

  const handleNext = async () => {
    if (/^\d{9,10}$/.test(uid)) {
      setIsLoading(true);
      await fetchPlayerData();

      if (userId && rememberUid) {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { [`${gameId}_UID`]: uid}, { merge: true });
      }

      setIsLoading(false);
    } else {
      setError(true);
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
    const { equipTypeToIndex } = translate(gameId);
    setIsLoading(true);
    const charBuffer =
      gameId === "gi" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.avatarId.toString();
          const data = template(gameId);

          // avatar
          data.level = charObj.propMap["4001"].val;
          data.rank = charObj.talentIdList?.length ?? 0;
    
          // weapon
          const weaponObj = charObj.equipList[charObj.equipList.length - 1];
          data.weaponId = weaponObj.itemId.toString();
          data.weaponLevel = weaponObj.weapon.level;
          data.weaponRank = (Object.values(weaponObj.weapon.affixMap ?? { rank: 0 })[0] + 1);

          // equipList
          const equipListArr = charObj.equipList.slice(0, -1);
          for (const equipObj of equipListArr) {
            const equipIndex = equipTypeToIndex[equipObj.flat.equipType];
            data.equipList[equipIndex].setId = equipObj.flat.icon.substring(13, 18);
            data.equipList[equipIndex].key = statKey.MAIN[equipObj.flat.reliquaryMainstat.mainPropId];
            const reliqSubArr = equipObj.flat.reliquarySubstats;
            for (const [subIndex, reliqSubObj] of reliqSubArr.entries()) {
              data.equipList[equipIndex].statMap[subIndex].key = statKey.SUB[reliqSubObj.appendPropId];
              data.equipList[equipIndex].statMap[subIndex].value = reliqSubObj.statValue.toString();
            }
          }

          // skillMap
          const skillsArr = Object.values(charObj.skillLevelMap);
          data.skillMap.basic = skillsArr[0];
          data.skillMap.skill = skillsArr[1];
          data.skillMap.ult = skillsArr[2];

          return { id, data };
        }) :
      gameId === "hsr" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.avatarId.toString();
          const data = template(gameId);

          // avatar
          data.level = charObj.level.toString();
          data.rank = charObj.rank ?? 0;

          // weapon
          const weaponObj = charObj.equipment;
          data.weaponId = (weaponObj?.tid ?? "").toString();
          data.weaponLevel = weaponObj?.level ?? null;
          data.weaponRank = weaponObj?.rank ?? null;

          // equipList
          const relicListArr = charObj.relicList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.type - 1;
            equipList[equipIndex].setId = relicObj._flat.setID.toString();
            equipList[equipIndex].key = statKey.MAIN[relicObj._flat.props[0].type];
            const subPropsArr = relicObj._flat.props.slice(1);
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              equipList[equipIndex].statMap[subIndex].key = statKey.SUB[subPropObj.type];
              const ratio = subPropObj.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = ratio === 1 ? 1 : 10;
              equipList[equipIndex].statMap[subIndex].value = Math.round((subPropObj.value * ratio) * roundAmount) / roundAmount;
            }
          }

          // skillMap
          const skillsArr = charObj.skillTreeList;
          data.skillMap.basic = skillsArr[0].level;
          data.skillMap.skill = skillsArr[1].level;
          data.skillMap.ult = skillsArr[2].level;
          data.skillMap.talent = skillsArr[3].level;

          return { id, data };
        }) :
      gameId === "ww" ?
        [] :
      gameId === "zzz" &&
        [];

    // update states
    for (const char of charBuffer) {
      if (userId) {
        const docRef = doc(db, "users", userId, gameId, char.id);
        await setDoc(docRef, char.data, { merge: false });
      }

      setLocalDocs((prev) => ({
        ...prev,
        [char.id]: char.data,
      }));
    }

    // cleanup
    setError(false);
    setSelectedAvatars([]);
    setEnkaList([]);
    setIsLoading(false);
    setRememberUid(false);
    setAction({});
  };

  const handleCancel = () => {
    setError(false);
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
                value={uid ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*$/.test(newValue);
                  if (isValidNumber) setUid(newValue);
                }}
                error={error}
                helperText={error && "Invalid UID"}
                fullWidth
              />
              <Stack direction="row" alignItems="center">
                <Checkbox
                  onChange={() => setRememberUid(!rememberUid)}
                  checked={rememberUid}
                  size="small"
                  disabled={!userId}
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
                    {avatarData[avatar.avatarId].name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Button onClick={handleSave} loading={isLoading} variant="contained">
              Save
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ModalLoad;
