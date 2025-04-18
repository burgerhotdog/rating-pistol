import { Autocomplete, TextField, Paper } from "@mui/material";
import { INFO_DATA, STAT_DATA } from "@data";

const Mainstat = ({ gameId, modalPipe, setModalPipe, mainIndex }) => {
  const mainstatOptions = Object.keys(STAT_DATA[gameId])
    .filter((stat) => (
      STAT_DATA[gameId][stat].mainIndex?.includes(mainIndex)
    ));

  const handleMainstat = (newValue) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => {
          if (index !== mainIndex) return equipObj;
          return {
            ...equipObj,
            stat: String(newValue),
            statList: Array(INFO_DATA[gameId].SUB_LEN).fill()
              .map(() => ({ stat: null, value: null })),
          };
        }),
      },
    }));
  };

  return (
    <Autocomplete
      value={modalPipe.data.equipList[mainIndex].stat ?? ""}
      options={mainstatOptions}
      getOptionLabel={(stat) => STAT_DATA[gameId][stat]?.name ?? ""}
      onChange={(_, newValue) => handleMainstat(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Mainstat" />
      )}
      slots={{
        paper: ({ children }) => (
          <Paper elevation={3}>
            {children}
          </Paper>
        ),
      }}
    />
  )
};

export default Mainstat;
