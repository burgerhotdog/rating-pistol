import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/hooks';
import { getDefaultWeapRank } from '@/utils';
import { Autocomplete } from './Autocomplete';

const WeaponId = ({ memberId, weaponId, member, setMember }) => {
  const { gameId } = useParams();

  const weaponData = useData('weapon');
  const memberData = useData('character')[memberId];
  const memberType = memberData?.type;

  const options = useMemo(
    () => Object.values(weaponData)
      .filter((weapon) => weapon.type === memberType)
      .sort((a, b) => b.quality - a.quality || a.name.localeCompare(b.name)),
    [weaponData, memberType],
  );

  const value = options.find((weapon) => weapon.id === weaponId);

  return (
    <Autocomplete
      options={options}
      groupBy={(weapon) => weapon.quality}
      value={value ?? null}
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
