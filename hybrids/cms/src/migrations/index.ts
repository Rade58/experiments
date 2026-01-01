import * as migration_20260101_074003 from './20260101_074003';

export const migrations = [
  {
    up: migration_20260101_074003.up,
    down: migration_20260101_074003.down,
    name: '20260101_074003'
  },
];
