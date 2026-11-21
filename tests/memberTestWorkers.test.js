import { afterEach, describe, expect, it, vi } from 'vitest';
import { memberTests } from '@/workers/simulation/member-tests';

const createWorkers = () => {
  const workers = [];
  class MockWorker {
    constructor(url, options) {
      this.url = url;
      this.options = options;
      this.postMessage = vi.fn();
      this.terminate = vi.fn();
      workers.push(this);
    }
  }
  vi.stubGlobal('Worker', MockWorker);
  return workers;
};

afterEach(() => vi.unstubAllGlobals());

describe('parallel member tests', () => {
  it('starts all slot workers together and retains team order', async () => {
    const workers = createWorkers();
    const team = [{ id: 1 }, { id: 2 }, { id: null }, { id: 3 }, { id: 4 }];
    const cache = { gameId: 'game', memberIds: [1, 4, 3, 2] };
    const equipMaps = { 1: { atk: 100 } };
    const builds = { 5: { equipList: [] } };

    const pending = memberTests(team, cache, equipMaps, 1, builds, 42);

    expect(workers).toHaveLength(3);
    for (const [index, memberId] of [2, 3, 4].entries()) {
      expect(workers[index].options).toEqual({ type: 'module' });
      expect(workers[index].postMessage).toHaveBeenCalledWith({
        team, cache, equipMaps, charId: 1, builds, userDps: 42, memberId,
      });
    }

    workers[2].onmessage({ data: ['fourth'] });
    workers[0].onmessage({ data: ['second'] });
    expect(workers.every((worker) => !worker.terminate.mock.calls.length)).toBe(true);
    workers[1].onmessage({ data: ['third'] });

    await expect(pending).resolves.toEqual([null, ['second'], ['third'], ['fourth']]);
    expect(workers.every((worker) => worker.terminate.mock.calls.length === 1)).toBe(true);
  });

  it('cleans up every worker and rejects if a worker fails', async () => {
    const workers = createWorkers();
    const pending = memberTests([{ id: 1 }, { id: 2 }, { id: 3 }], {
      gameId: 'game', memberIds: [1, 2, 3],
    }, {}, 1, {}, 42);
    const rejection = expect(pending).rejects.toThrow('Member test failed for 2: failure');

    workers[0].onerror({ message: 'failure', preventDefault: vi.fn() });

    await rejection;
    expect(workers.every((worker) => worker.terminate.mock.calls.length === 1)).toBe(true);
  });

  it('does not spawn workers for a team with only the main character', async () => {
    const workers = createWorkers();
    await expect(memberTests([{ id: 1 }, { id: null }], {
      gameId: 'game', memberIds: [1],
    }, {}, 1, {}, 42)).resolves.toEqual([null]);
    expect(workers).toHaveLength(0);
  });
});
