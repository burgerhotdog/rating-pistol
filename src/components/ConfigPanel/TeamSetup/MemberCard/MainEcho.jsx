import { useEffect, useMemo } from 'react';
import { useData } from '@/hooks';
import { Autocomplete } from '../../../Autocomplete';

const MainEcho = ({ memberId, setCounts = {}, mainEcho, onChange }) => {
  const echoData = useData('echo');

  const options = useMemo(
    () => Object.values(echoData)
      .filter((echo) => echo.sets.some((set) => set in setCounts))
      .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name)),
    [echoData, setCounts],
  );


  useEffect(() => {
    const value = options.find((echo) => echo.id === mainEcho);
    if (mainEcho && !value) onChange(null);
  }, [options, mainEcho, onChange]);

  return (
    <Autocomplete
      options={options}
      groupBy={(echo) => echo.cost}
      valueId={mainEcho}
      onChange={onChange}
      label="Main Echo"
      disabled={!memberId}
    />
  );
};

export default MainEcho;
