import { Autocomplete, TextField } from "@mui/material";
import { INFO, STATS } from "@data/static";
import { statObjTemplate } from "@config/templates";

const Mainstat = ({ gameId, pipe, setPipe, mainIndex }) => {
  const mainstatOptions = Object.keys(STATS[gameId])
    .filter((stat) => STATS[gameId][stat].index?.includes(mainIndex));

  const handleMainstat = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => 
          index === mainIndex
            ? {
              ...equipObj,
              stat: String(newValue),
              statList: Array(INFO[gameId].SUB_LEN)
                .fill()
                .map(() => ({ ...statObjTemplate })),
            }
            : equipObj
        ),
      },
    }));
  };

  return (
    <Autocomplete
      value={pipe.data.equipList[mainIndex].stat ?? ""}
      options={mainstatOptions}
      getOptionLabel={(stat) => STATS[gameId][stat]?.name ?? ""}
      onChange={(_, newValue) => handleMainstat(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Mainstat" />
      )}
    />
  )
};

export default Mainstat;
