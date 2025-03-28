import React, { useEffect, useState } from "react";
import { writeBatch, doc, getDoc, setDoc } from "firebase/firestore";
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
import getImgs from "../../getImgs";
import translate from "./translate";

const LoadModal = ({
  gameId,
  userId,
  setModalPipe,
  setLocalDocs
}) => {
  const { STAT_INDEX, AVATAR_DATA } = getData[gameId];
  const { AVATAR_IMGS } = getImgs[gameId];
  const [error, setError] = useState(false);
  const [uid, setUid] = useState(null);
  const [rememberUid, setRememberUid] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { STAT_CONVERT } = translate[gameId];

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
    const { maleToFemale } = translate[gameId];
    
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
    const { equipTypeToIndex } = translate[gameId];
    setIsLoading(true);
    const charBuffer =
      gameId === "gi" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = String(charObj.avatarId);
          const data = template(gameId);

          // avatar
          data.level = String(charObj.propMap["4001"].val);
          data.rank = String(charObj.talentIdList?.length ?? 0);
    
          // weapon
          const weaponObj = charObj.equipList[charObj.equipList.length - 1];
          data.weaponId = String(weaponObj.itemId);
          data.weaponLevel = String(weaponObj.weapon.level);
          const weaponRank = Object.values(weaponObj.weapon.affixMap ?? { rank: 0 })[0] + 1;
          data.weaponRank = String(weaponRank);

          // equipList
          const equipListArr = charObj.equipList.slice(0, -1);
          for (const equipObj of equipListArr) {
            const equipIndex = equipTypeToIndex[equipObj.flat.equipType];
            data.equipList[equipIndex].setId = equipObj.flat.icon.substring(13, 18);
            data.equipList[equipIndex].key = STAT_CONVERT[equipObj.flat.reliquaryMainstat.mainPropId];
            const reliqSubArr = equipObj.flat.reliquarySubstats;
            for (const [subIndex, reliqSubObj] of reliqSubArr.entries()) {
              data.equipList[equipIndex].statMap[subIndex].key = STAT_CONVERT[reliqSubObj.appendPropId];
              data.equipList[equipIndex].statMap[subIndex].value = String(reliqSubObj.statValue);
            }
          }

          // skillMap
          const skillsArr = Object.values(charObj.skillLevelMap);
          data.skillMap["001"] = Number(skillsArr[skillsArr.length - 3]);
          data.skillMap["002"] = Number(skillsArr[skillsArr.length - 2]);
          data.skillMap["003"] = Number(skillsArr[skillsArr.length - 1]);

          return { id, data };
        }) :
      gameId === "hsr" ?
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = String(charObj.avatarId);
          const data = template(gameId);
          if (AVATAR_DATA[id].type === "Remembrance") {
            data.skillMap.memoSkill = "1";
            data.skillMap.memoTalent = "1";
          }

          // avatar
          data.level = String(charObj.level);
          data.rank = String(charObj.rank ?? 0);

          // weapon
          const weaponObj = charObj.equipment;
          if (weaponObj?.tid) {
            data.weaponId = String(weaponObj.tid);
            data.weaponLevel = String(weaponObj.level);
            data.weaponRank = String(weaponObj.rank);
          }

          // equipList
          const relicListArr = charObj.relicList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.type - 1;
            data.equipList[equipIndex].setId = String(relicObj._flat.setID);
            data.equipList[equipIndex].key = STAT_CONVERT[relicObj._flat.props[0].type];
            const subPropsArr = relicObj._flat.props.slice(1);
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              data.equipList[equipIndex].statMap[subIndex].key = STAT_CONVERT[subPropObj.type];
              const valueRatio = subPropObj.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              data.equipList[equipIndex].statMap[subIndex].value = Math.round((subPropObj.value * valueRatio) * roundAmount) / roundAmount;
            }
          }

          // skillMap
          const skillsArr = charObj.skillTreeList;
          for (const { pointId, level } of skillsArr) {
            const skillId = String(pointId).slice(4);
            if (skillId[0] === "3") {
              data.skillMap[`00${Number(skillId[2]) + 4}`] = Number(level);
            } else {
              data.skillMap[skillId] = Number(level);
            }
          }

          return { id, data };
        }) :
      gameId === "ww" ?
        [] :
      gameId === "zzz" &&
        selectedAvatars.map((selectedAvatar) => {
          const charObj = enkaList[selectedAvatar];
          const id = String(charObj.Id);
          const data = template(gameId);

          // avatar
          data.level = String(charObj.Level);
          data.rank = String(charObj.TalentLevel);

          // weapon
          const weaponObj = charObj.Weapon;
          if (weaponObj?.Id) {
            data.weaponId = String(weaponObj.Id);
            data.weaponLevel = String(weaponObj.Level)
            data.weaponRank = String(weaponObj.UpgradeLevel);
          }

          // equipList
          const relicListArr = charObj.EquippedList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.Slot - 1;
            data.equipList[equipIndex].setId = `${Math.floor(relicObj.Equipment.Id / 100)}00`;
            data.equipList[equipIndex].key = STAT_CONVERT[relicObj.Equipment.MainPropertyList[0].PropertyId];
            const subPropsArr = relicObj.Equipment.RandomPropertyList;
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              const key = STAT_CONVERT[String(subPropObj.PropertyId)];
              data.equipList[equipIndex].statMap[subIndex].key = key;
              const value = subPropObj.PropertyValue;
              const valueRatio = STAT_INDEX[key].percent ? 0.01 : 1;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              const timesAppeared = subPropObj.PropertyLevel;
              data.equipList[equipIndex].statMap[subIndex].value = Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
            }
          }

          // skillMap
          const skillsArr = charObj.SkillLevelList;
          data.skillMap["001"] = Number(skillsArr[0].Level);
          data.skillMap["002"] = Number(skillsArr[1].Level);
          data.skillMap["003"] = Number(skillsArr[3].Level);
          data.skillMap["004"] = Number(skillsArr[2].Level);
          data.skillMap["005"] = Number(skillsArr[5].Level);
          data.skillMap["006"] = Number(skillsArr[4].Level);

          return { id, data };
        });

    const localUpdates = {};
    const batch = userId ? writeBatch(db) : null;
    charBuffer.forEach(({ id, data }) => {
      localUpdates[id] = data;
      if (userId) {
        const docRef = doc(db, "users", userId, gameId, id);
        batch.set(docRef, data, { merge: true });
      }
    });
    if (userId) await batch.commit();

    setLocalDocs((prev) => ({
      ...prev,
      ...localUpdates,
    }));

    setModalPipe({});
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
          Select characters to add.
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
                  src={AVATAR_IMGS[`./${avatar.avatarId}.webp`]?.default}
                  alt={avatar.avatarId}
                  sx={{ width: 25, height: 25, objectFit: "contain" }}
                />

                <Typography variant="body2">
                  {AVATAR_DATA[avatar.avatarId].name}
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
