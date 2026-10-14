import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/hooks';
import { getDefaultWeapRank } from '@/utils';
import { Autocomplete } from '../../../Autocomplete';

const WeaponId = ({ memberId, weaponId, member, setMember }) => {
  const { gameId } = useParams();
  const charDatas = useData('character');
  const weapDatas = useData('weapon');

  const memberType = charDatas[memberId]?.type;

  const options = useMemo(
    () => Object.values(weapDatas)
      .filter((weapData) => weapData.type === memberType)
      .sort((a, b) =>
        b.quality - a.quality ||
        b.version - a.version ||
        b.id - a.id
      ),
    [weapDatas, memberType],
  );

  return (
    <Autocomplete
      options={options}
      groupBy={(weapon) => weapon.quality}
      valueId={weaponId}
      onChange={(weaponId) => setMember({
        ...member,
        weaponId,
        weaponRank: weaponId && getDefaultWeapRank(gameId, weaponId),
      })}
      label="Weapon"
      disabled={!memberId}
      fullWidth
    />
  );
};

export default WeaponId;
