# Rating Pistol

Character rating and simulation tool for Genshin Impact, Honkai Star Rail, Wuthering Waves, and Zenless Zone Zero.

## Rotation benchmark

Run the same default team setup as `npm run rotation`, using a game abbreviation (`gi`, `hsr`, `ww`, or `zzz`) and character names:

```sh
npm run rotation:benchmark -- gi "Kamisato Ayaka" --warmup=20 --iterations=200
```

Both counts are optional; the defaults are shown above. Warmup can be zero, and iterations must be positive. The benchmark prepares the team and cache once, then times `runRotation` with empty equipment maps, excluding setup, summaries, and file output. It reports per-rotation average, median, p95, and range in milliseconds, along with the initial result's snapshot count and totals.

After warmup, it estimates the measured rotations' total duration from the warmup's average runtime. This is only an estimate and is unavailable when warmup is zero.

For comparisons, run the same command several times before and after a change, under similar system conditions, and check the totals for unexpected differences. Results are measured in Node, so browser performance may differ.
