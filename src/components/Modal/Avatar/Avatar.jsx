import { useState } from "react";
import { Stack, Divider, Button } from "@mui/material";
import Level from "./Level";
import Rank from "./Rank";
import SkillMap from "./SkillMap";

const Avatar = ({ gameId, modalPipe, saveAvatar, closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, data } = modalPipe;
  const [level, setLevel] = useState(data.level);
  const [rank, setRank] = useState(data.rank);
  const [skillMap, setSkillMap] = useState({ ...data.skillMap });

  const handleSave = async () => {
    setIsLoading(true);
    const newData = { ...data, level, rank, skillMap };
    await saveAvatar(id, newData);
    closeModal();
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack direction="row" spacing={2}>
        <Stack direction="row" spacing={2}>
          <Level
            gameId={gameId}
            level={level}
            setLevel={setLevel}
          />
          
          <Rank
            gameId={gameId}
            id={id}
            rank={rank}
            setRank={setRank}
          />
        </Stack>

        <Divider orientation="vertical" flexItem />

        <SkillMap
          gameId={gameId}
          id={id}
          rank={rank}
          skillMap={skillMap}
          setSkillMap={setSkillMap}
        />
      </Stack>

      <Button
        onClick={handleSave}
        loading={isLoading}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

export default Avatar;
