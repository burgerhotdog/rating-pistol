export async function memberTests(team, cache, equipMaps, charId, builds, userDps) {
  const workers = [];
  const payload = {
    team,
    cache: { gameId: cache.gameId, memberIds: cache.memberIds },
    equipMaps,
    charId,
    builds,
    userDps,
  };

  try {
    return await Promise.all(team.filter((member) => member.id).map(async ({ id: memberId }) => {
      if (memberId === charId) return null;

      const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
      workers.push(worker);

      return new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => resolve(data);
        worker.onerror = (event) => {
          event.preventDefault();
          reject(new Error(`Member test failed for ${memberId}: ${event.message}`));
        };
        worker.onmessageerror = () => reject(new Error(`Could not read member test results for ${memberId}`));
        worker.postMessage({ ...payload, memberId });
      });
    }));
  } finally {
    workers.forEach((worker) => worker.terminate());
  }
}
