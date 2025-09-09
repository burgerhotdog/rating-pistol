import { useState, useMemo } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography, CircularProgress } from '@mui/material';
import { AVATAR_DATA } from '@data';
import StarCell from './StarCell';
import AvatarCell from './AvatarCell';
import RatingCell from './RatingCell';
import FilterCell from './FilterCell';

const CustomTable = ({ gameId, userId, starred, setStarred, avatarCache, isLoading, setModalPipe }) => {
  // filter lists
  const [fRaritys, setFRaritys] = useState([]);
  const [fElements, setFElements] = useState([]);
  const [fTypes, setFTypes] = useState([]);

  const sortedAvatars = useMemo(() => {
    return Object.entries(avatarCache)
      .sort(([aId, { rating: aRating }], [bId, { rating: bRating }]) => {
        const aIsStar = starred.includes(Number(aId));
        const bIsStar = starred.includes(Number(bId));
        if (aIsStar !== bIsStar) return bIsStar - aIsStar;

        const aScore = aRating ? aRating.rolls / aRating.bench : -1;
        const bScore = bRating ? bRating.rolls / bRating.bench : -1;
        return bScore - aScore;
      })
      .map(([avatarId]) => Number(avatarId));
  }, [avatarCache, starred]);

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
            filteredAvatars.map(avatarId => (
              <TableRow key={avatarId}>
                <StarCell
                  gameId={gameId}
                  userId={userId}
                  id={avatarId}
                  starred={starred}
                  setStarred={setStarred}
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
