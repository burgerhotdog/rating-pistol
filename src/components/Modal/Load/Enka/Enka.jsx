import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import {
  Box,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import template from "@config/template";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA, SET_DATA, STAT_DATA } from "@data";
import translate from "./translate";

const errorMessages = {
  400: "Wrong UID format",
  404: "Player does not exist",
  424: "Game maintenance",
  429: "Rate-limited",
  500: "General server error",
  503: "Server error",
  600: "Profile showcase empty",
};

const suffixes = {
  gi: "uid/",
  hsr: "hsr/uid/",
  zzz: "zzz/uid/",
};

const urlBase = "https://rating-pistol.vercel.app/api/proxy?suffix=";

const Enka = ({ gameId, userId, saveAvatarBatch, closeModal }) => {
  const [error, setError] = useState(null);
  const [uid, setUid] = useState(null);
  const [rememberUid, setRememberUid] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { STAT_CONVERT } = translate[gameId];
  const suffix = suffixes[gameId];

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

  const fetchData = async () => {
    setError(null);
    setIsLoading(true);

    // fetch api response
    const response = await fetch(`${urlBase}${suffix}${uid}`);
    if (!response.ok) {
      setError(response.status);
      setIsLoading(false);
      return false;
    }

    // parse avatarList
    const rawEnka = await response.json();
    const avatarList = {
      gi: rawEnka.avatarInfoList,
      hsr: rawEnka.detailInfo?.avatarDetailList,
      zzz: rawEnka.PlayerInfo?.ShowcaseDetail?.AvatarList,
    }[gameId];
    if (!avatarList) {
      setError(600);
      setIsLoading(false);
      return false;
    }

    // convert male mc to female mc
    const { energyConvert, maleToFemale } = translate[gameId];
    avatarList.forEach((rawItem, index) => {
      if (gameId === "gi" && (rawItem.avatarId === 10000005 || rawItem.avatarId === 10000007)) {
        const { energyType } = rawEnka.playerInfo.showAvatarInfoList[index];
        rawItem.avatarId = `${rawItem.avatarId}-${energyConvert[energyType]}`;
      }
      if (gameId !== "zzz" && maleToFemale[rawItem.avatarId]) {
        rawItem.avatarId = maleToFemale[rawItem.avatarId];
      }
      if (gameId === "zzz") {
        rawItem.avatarId = rawItem.Id;
      }
    });

    setEnkaList(avatarList);
    setIsLoading(false);
    return true;
  };

  const handleNext = async () => {
    const fetchSuccess = await fetchData();
    if (fetchSuccess && userId && rememberUid) {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { [`${gameId}_uid`]: uid }, { merge: true });
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
    setIsLoading(true);
    const charBuffer = selectedAvatars.map((selectedAvatar) => {
      const charObj = enkaList[selectedAvatar];
      switch (gameId) {
        case "gi": {
          const id = String(charObj.avatarId);
          const data = template(gameId);
    
          // weapon
          const weaponObj = charObj.equipList[charObj.equipList.length - 1];
          data.weaponId = String(weaponObj.itemId);

          // equipList
          const { equipTypeToIndex } = translate[gameId];
          const equipListArr = charObj.equipList.slice(0, -1);
          for (const equipObj of equipListArr) {
            const equipIndex = equipTypeToIndex[equipObj.flat.equipType];

            // set
            if (!SET_DATA[gameId][equipObj.flat.icon.substring(13, 18)]) continue;
            data.equipList[equipIndex].setId = equipObj.flat.icon.substring(13, 18);

            // mainstat
            data.equipList[equipIndex].stat = STAT_CONVERT[equipObj.flat.reliquaryMainstat.mainPropId];

            // substats
            const reliqSubArr = equipObj.flat.reliquarySubstats;
            if (!reliqSubArr) continue;
            for (const [subIndex, reliqSubObj] of reliqSubArr.entries()) {
              data.equipList[equipIndex].statList[subIndex].stat = STAT_CONVERT[reliqSubObj.appendPropId];
              data.equipList[equipIndex].statList[subIndex].value = Number(reliqSubObj.statValue);
            }
          }

          return [id, data];
        }

        case "hsr": {
          const id = String(charObj.avatarId);
          const data = template(gameId);

          // weapon
          const weaponObj = charObj.equipment;
          if (weaponObj?.tid) {
            data.weaponId = String(weaponObj.tid);
          }

          // equipList
          const relicListArr = charObj.relicList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.type - 1;

            // set
            data.equipList[equipIndex].setId = String(relicObj._flat.setID);

            // mainstat
            data.equipList[equipIndex].stat = STAT_CONVERT[relicObj._flat.props[0].type];

            // substats
            const subPropsArr = relicObj._flat.props.slice(1);
            if (!subPropsArr) continue;
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              data.equipList[equipIndex].statList[subIndex].stat = STAT_CONVERT[subPropObj.type];
              const valueRatio = subPropObj.type.slice(-5) === "Delta" ? 1 : 100;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              data.equipList[equipIndex].statList[subIndex].value = Math.round((subPropObj.value * valueRatio) * roundAmount) / roundAmount;
            }
          }

          return [id, data];
        }

        case "zzz": {
          const id = String(charObj.Id);
          const data = template(gameId);

          // weapon
          const weaponObj = charObj.Weapon;
          if (weaponObj?.Id) {
            data.weaponId = String(weaponObj.Id);
          }

          // equipList
          const relicListArr = charObj.EquippedList;
          for (const relicObj of relicListArr) {
            const equipIndex = relicObj.Slot - 1;

            // set
            data.equipList[equipIndex].setId = `${Math.floor(relicObj.Equipment.Id / 100)}00`;

            // mainstat
            data.equipList[equipIndex].stat = STAT_CONVERT[relicObj.Equipment.MainPropertyList[0].PropertyId];

            // substats
            const subPropsArr = relicObj.Equipment.RandomPropertyList;
            if (!subPropsArr) continue;
            for (const [subIndex, subPropObj] of subPropsArr.entries()) {
              const key = STAT_CONVERT[String(subPropObj.PropertyId)];
              data.equipList[equipIndex].statList[subIndex].stat = key;
              const value = subPropObj.PropertyValue;
              const valueRatio = STAT_DATA[gameId][key].showPercent ? 0.01 : 1;
              const roundAmount = valueRatio === 1 ? 1 : 10;
              const timesAppeared = subPropObj.PropertyLevel;
              data.equipList[equipIndex].statList[subIndex].value = Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
            }
          }

          return [id, data];
        }
      }
    });

    saveAvatarBatch(charBuffer);
    closeModal();
  };

  if (!enkaList.length) {
    return (
      <Stack alignItems="center" spacing={2}>
        <Stack>
          <TextField
            label="Enter UID"
            value={uid ?? ""}
            onChange={(e) => setUid(e.target.value)}
            error={!!error}
            helperText={error && errorMessages[error]}
          />

          <Stack direction="row" alignItems="center">
            <Checkbox
              onChange={() => setRememberUid(!rememberUid)}
              checked={rememberUid}
              disabled={!userId}
            />

            <Typography variant="body2" color="text.secondary">
              Remember UID (requires sign-in)
            </Typography>
          </Stack>
        </Stack>

        <Button onClick={handleNext} variant="contained" loading={isLoading}>
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
                  src={AVATAR_ASSETS[gameId][avatar.avatarId].icon}
                  alt={avatar.avatarId}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />

                <Typography variant="body2">
                  {AVATAR_DATA[gameId][avatar.avatarId].name}
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

export default Enka;