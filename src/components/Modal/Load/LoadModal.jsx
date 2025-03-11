import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  Box,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import template from "../../template";
import getData from "../../getData";
import getIcons from "../../getIcons";
import translate from "./translate";

const LoadModal = ({
  gameId,
  userId,
  saveAction,
  closeAction,
}) => {
  const { equipData, avatarData } = getData[gameId];
  const { avatarIcons } = getIcons[gameId];
  const [error, setError] = useState(false);
  const [uid, setUid] = useState(null);
  const [rememberUid, setRememberUid] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { STAT_INDEX } = translate(gameId);

  const suffix = {
    gi: "uid/",
    hsr: "hsr/uid/",
    ww: "",
    zzz: "zzz/uid/",
  };

  useEffect(() => {
    const fetchUid = async () => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const newUid = userDoc.exists() ? userDoc.data()?.[`${gameId}_uid`] : null;
      
      setUid(newUid ?? null);
      setRememberUid(!!newUid);
    };
  
    fetchUid();
  }, [userId, gameId]);
  
  // gi 604379917
  // hsr 602849613
  // zzz 1000147721
  const fetchPlayerData = async () => {
    const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix[gameId]+uid}/`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from Enka API:", errorData);
      setError(true);
      return false;
    }

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
        for (const rawItem of rawEnka.detailInfo.avatarDetailList) {
          if (maleToFemale[rawItem.avatarId]) {
            rawItem.avatarId = maleToFemale[rawItem.avatarId];
          }
        }

        setEnkaList(rawEnka.detailInfo.avatarDetailList);
        break;

      case "ww":
        break;

      case "zzz":
        for (const rawItem of rawEnka.PlayerInfo.ShowcaseDetail.AvatarList) {
          rawItem.avatarId = rawItem.Id;
        }
        setEnkaList(rawEnka.PlayerInfo.ShowcaseDetail.AvatarList);
        break;
    }

    setError(false);
    return true;
  };

  const handleNext = async () => {
    setIsLoading(true);
    if (await fetchPlayerData()) {
      if (userId && rememberUid) {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { [`${gameId}_uid`]: uid}, { merge: true });
      }
    }
    setIsLoading(false);
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
            data.equipList[equipIndex].key = STAT_INDEX[equipObj.flat.reliquaryMainstat.mainPropId];
            const reliqSubArr = equipObj.flat.reliquarySubstats;
            for (const [subIndex, reliqSubObj] of reliqSubArr.entries()) {
              data.equipList[equipIndex].statMap[subIndex].key = STAT_INDEX[reliqSubObj.appendPropId];
              data.equipList[equipIndex].statMap[subIndex].value = reliqSubObj.statValue.toString();
            }
          }

          // skillMap
          const skillsArr = Object.values(charObj.skillLevelMap);
          data.skillMap.basic = skillsArr[skillsArr.length - 3];
          data.skillMap.skill = skillsArr[skillsArr.length - 2];
          data.skillMap.ult = skillsArr[skillsArr.length - 1];

          return { id, data };
        }) :
      gameId === "hsr" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.avatarId.toString();
          const data = template(gameId);

          // avatar
          data.level = charObj.level;
          data.rank = charObj.rank ?? 0;

          // weapon
          const weaponObj = charObj.equipment;
          if (weaponObj) {
            data.weaponId = String(weaponObj?.tid);
            data.weaponLevel = weaponObj.level ?? null;
            data.weaponRank = weaponObj.rank ?? null;
          }

          // equipList
          const relicListArr = charObj.relicList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.type - 1;
            data.equipList[equipIndex].setId = relicObj._flat.setID.toString();
            data.equipList[equipIndex].key = STAT_INDEX[relicObj._flat.props[0].type];
            const subPropsArr = relicObj._flat.props.slice(1);
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              data.equipList[equipIndex].statMap[subIndex].key = STAT_INDEX[subPropObj.type];
              const valueRatio = subPropObj.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              data.equipList[equipIndex].statMap[subIndex].value = Math.round((subPropObj.value * valueRatio) * roundAmount) / roundAmount;
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
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = charObj.Id.toString();
          const data = template(gameId);

          // avatar
          data.level = charObj.Level;
          data.rank = charObj.TalentLevel;

          // weapon
          const weaponObj = charObj.Weapon;
          if (weaponObj) {
            data.weaponId = String(weaponObj.Id);
            data.weaponLevel = weaponObj.Level ?? null;
            data.weaponRank = weaponObj.UpgradeLevel ?? null;
          }

          // equipList
          const relicListArr = charObj.EquippedList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.Slot - 1;
            data.equipList[equipIndex].setId = `${Math.floor(relicObj.Equipment.Id / 100)}00`;
            data.equipList[equipIndex].key = STAT_INDEX[relicObj.Equipment.MainPropertyList[0].PropertyId];
            const subPropsArr = relicObj.Equipment.RandomPropertyList;
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              const key = STAT_INDEX[String(subPropObj.PropertyId)];
              data.equipList[equipIndex].statMap[subIndex].key = key;
              const value = subPropObj.PropertyValue;
              const valueRatio = equipData.STAT_INDEX[key].percent ? 0.01 : 1;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              const timesAppeared = subPropObj.PropertyLevel;
              data.equipList[equipIndex].statMap[subIndex].value = Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
            }
          }

          // skillMap
          const skillsArr = charObj.SkillLevelList;
          data.skillMap.basic = skillsArr[0].Level;
          data.skillMap.skill = skillsArr[1].Level;
          data.skillMap.ult = skillsArr[3].Level;
          data.skillMap.dodge = skillsArr[2].Level;
          data.skillMap.assist = skillsArr[5].Level;
          data.skillMap.core = skillsArr[4].Level - 1;

          return { id, data };
        });

    await Promise.all(charBuffer.map(char => saveAction(char.id, char.data)));

    closeAction({});
  };

  if (!enkaList.length) {
    return (
      <Stack alignItems="center" spacing={2}>
        <Stack>
          <TextField
            label="Enter UID"
            value={uid ?? ""}
            onChange={(e) => {
              const newValue = e.target.value;
              const isValidNumber = /^\d*$/.test(newValue);
              if (isValidNumber) setUid(newValue);
            }}
            error={error}
            helperText={error && "Invalid UID"}
          />

          <Stack direction="row" alignItems="center">
            <Checkbox
              onChange={() => setRememberUid(!rememberUid)}
              checked={rememberUid}
              disabled={!userId}
            />

            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Remember UID (requires sign-in)
            </Typography>
          </Stack>
        </Stack>

        <Button
          onClick={handleNext}
          variant="contained"
          loading={isLoading}
        >
          Next
        </Button>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack>
        <Typography variant="subtitle1">
          Select the characters to add.
        </Typography>

        {enkaList.map((avatar, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                onChange={(e) => handleCheckboxChange(e, index)}
                checked={selectedAvatars.includes(index)}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  loading="lazy"
                  src={avatarIcons[`./${avatar.avatarId}.webp`]?.default}
                  alt={avatar.avatarId}
                  sx={{ width: 25, height: 25, objectFit: "contain" }}
                />

                <Typography variant="body2">
                  {avatarData[avatar.avatarId].name}
                </Typography>
              </Stack>
            }
            onClick={(e) => e.stopPropagation()}
          />
        ))}
      </Stack>
      
      <Button onClick={handleSave} loading={isLoading} variant="contained">
        Save
      </Button>
    </Stack>
  );
};

export default LoadModal;
