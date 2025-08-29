import { useState, useMemo } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography, CircularProgress } from '@mui/material';
import { AVATAR_DATA } from '@data';
import StarCell from './StarCell';
import AvatarCell from './AvatarCell';
import RatingCell from './RatingCell';
import FilterCell from './FilterCell';

const CustomTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, setModalPipe }) => {
  // filter lists
  const [fRaritys, setFRaritys] = useState([]);
  const [fElements, setFElements] = useState([]);
  const [fTypes, setFTypes] = useState([]);

  const sortedAvatars = useMemo(() => (  
    Object.entries(avatarCache)
      .sort(([, a], [, b]) => {
        if (a.data.isStar !== b.data.isStar) return a.data.isStar ? -1 : 1;

        if (!a.rating && !b.rating) {
          if ((a.rating === null) === (b.rating === null)) return 0;
          return a.rating === null ? -1 : 1;
        }

        if (!a.rating) return 1;
        if (!b.rating) return -1;

        return ((b.rating.score / (b.rating.scoreMax / 2)) * 100) - ((a.rating.score / (a.rating.scoreMax / 2)) * 100);
      })
      .map(([avatarId]) => avatarId)
  ), [avatarCache]);

  const filteredAvatars = useMemo(() => {
    return sortedAvatars.filter(avatarId => {
      const { rarity, element, type } = AVATAR_DATA[gameId][avatarId];
      const rarityMatch = !fRaritys.length || fRaritys.includes(rarity);
      const elementMatch = !fElements.length || fElements.includes(element);
      const typeMatch = !fTypes.length || fTypes.includes(type);
      return rarityMatch && elementMatch && typeMatch;
    });
  }, [sortedAvatars, fRaritys, fElements, fTypes, gameId]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <FilterCell
                gameId={gameId}
                fRaritys={fRaritys}
                setFRaritys={setFRaritys}
                fElements={fElements}
                setFElements={setFElements}
                fTypes={fTypes}
                setFTypes={setFTypes}
              />
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
            <TableRow>
              <TableCell colSpan={3} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            filteredAvatars.map((avatarId) => (
              <TableRow key={avatarId}>
                <StarCell
                  gameId={gameId}
                  userId={userId}
                  setAvatarCache={setAvatarCache}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                />
                <AvatarCell
                  gameId={gameId}
                  setModalPipe={setModalPipe}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                />
                <RatingCell
                  gameId={gameId}
                  setModalPipe={setModalPipe}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                  rating={avatarCache[avatarId].rating}
                />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
