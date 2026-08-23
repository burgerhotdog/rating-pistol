import { useEffect, useMemo } from 'react';
import { useData } from '@/hooks';
import { Autocomplete } from './Autocomplete';

const MainEcho = ({ memberId, setCounts = {}, mainEcho, onChange }) => {
  const echoData = useData('echo');

  const options = useMemo(
    () => Object.values(echoData)
      .filter((echo) => echo.sets.some((set) => set in setCounts))
      .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name)),
    [echoData, setCounts],
  );

  const value = options.find((echo) => echo.id === mainEcho);

  useEffect(() => {
    if (mainEcho && !value) onChange(null);
  }, [mainEcho, value, onChange]);

  return (
    <Autocomplete
      options={options}
      groupBy={(echo) => echo.cost}
      value={value ?? null}
      onChange={onChange}
      label="Main Echo"
      disabled={!memberId}
    />
  );
};

export default MainEcho;
