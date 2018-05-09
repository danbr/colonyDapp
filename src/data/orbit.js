/* @flow */
import OrbitDB from 'orbit-db';
import type { ColonyIPFSNode, OrbitOptions, ColonyOrbitOptions } from './types';

const DEFAULT_DB_PATH = 'colonyOrbitdb';

type WrappedOptions = { path: ?string, options: OrbitOptions };

export function makeOptions({ repo }: ColonyOrbitOptions = {}): WrappedOptions {
  const dbPath = repo === undefined ? DEFAULT_DB_PATH : repo;
  return { path: dbPath, options: {} };
}

export async function getOrbitDB(
  ipfs: ColonyIPFSNode,
  { path, options }: WrappedOptions = { path: DEFAULT_DB_PATH, options: {} },
) {
  // console.log('Get OrbitDB instance with path:', path);
  return new OrbitDB(ipfs, path, options);
}
