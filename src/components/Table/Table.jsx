import { Skeleton, Stack, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography, IconButton, Tooltip, Box, FormGroup, FormControlLabel, Checkbox, Divider } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { StarBody, AvatarBody, RatingBody } from "./Cells";
import { AVATAR_DATA, INFO_DATA } from "@data";

const CustomTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedElements, setSelectedElements] = useState(new Set(INFO_DATA[gameId].ELEMENTS));
  const [selectedTypes, setSelectedTypes] = useState(new Set(INFO_DATA[gameId].TYPES));

  const handleElementChange = (element) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(element)) {
      newSelected.delete(element);
    } else {
      newSelected.add(element);
    }
    setSelectedElements(newSelected);
  };

  const handleTypeChange = (type) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedTypes(newSelected);
  };

  const filteredAvatars = useMemo(() => {
    return sortedAvatars.filter(avatarId => {
      const avatarData = AVATAR_DATA[gameId][avatarId];
      return selectedElements.has(avatarData.element) && selectedTypes.has(avatarData.type);
    });
  }, [sortedAvatars, selectedElements, selectedTypes, gameId]);

  const FilterTooltip = () => (
    <Box sx={{ p: 2, minWidth: 200 }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Elements
      </Typography>
      <FormGroup>
        {INFO_DATA[gameId].ELEMENTS.map((element) => (
          <FormControlLabel
            key={element}
            control={
              <Checkbox
                checked={selectedElements.has(element)}
                onChange={() => handleElementChange(element)}
                size="small"
              />
            }
            label={element}
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
          />
        ))}
      </FormGroup>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Weapon Types
      </Typography>
      <FormGroup>
        {INFO_DATA[gameId].TYPES.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.has(type)}
                onChange={() => handleTypeChange(type)}
                size="small"
              />
            }
            label={type}
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <TableContainer 
      component={Paper}
      sx={{
        maxHeight: 650,
        overflow: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table stickyHeader sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <Tooltip
                title={<FilterTooltip />}
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onOpen={() => setFilterOpen(true)}
                placement="bottom-start"
                disableHoverListener
                disableFocusListener
                disableTouchListener
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 3,
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FilterAlt />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Character
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Rating
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            [...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" display="inline-flex" spacing={1}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} height={36} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={60} height={36} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            filteredAvatars.map((avatarId) => (
              <TableRow
                key={avatarId}
                sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" } }}
              >
                <TableCell>
                  <StarBody
                    gameId={gameId}
                    userId={userId}
                    setAvatarCache={setAvatarCache}
                    id={avatarId}
                    data={avatarCache[avatarId].data}
                  />
                </TableCell>
                <TableCell>
                  <AvatarBody
                    gameId={gameId}
                    setModalPipe={setModalPipe}
                    id={avatarId}
                    data={avatarCache[avatarId].data}
                  />
                </TableCell>
                <TableCell>
                  <RatingBody
                    gameId={gameId}
                    setModalPipe={setModalPipe}
                    id={avatarId}
                    data={avatarCache[avatarId].data}
                    rating={avatarCache[avatarId].rating}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;