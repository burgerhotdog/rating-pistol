import { testAltMembers } from './memberTests';

self.onmessage = ({ data }) => {
  const { team, cache, equipMaps, charId, builds, userDps, memberId } = data;
  self.postMessage(testAltMembers(team, cache, equipMaps, charId, builds, userDps, memberId));
};
