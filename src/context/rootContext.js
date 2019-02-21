/* @flow */

import { DDB } from '../lib/database';
import IPFSNode from '../lib/ipfs';

import ipfsNodeContext from './ipfsNodeContext';
import DDBContext from './DDBContext';
import ensContext from './ensContext';
import { CONTEXT } from './constants';

export type RootContext = {|
  ipfsNode: IPFSNode,
  DDB: typeof DDB,
  ens: {},
|};

const rootContext: RootContext = {
  [CONTEXT.IPFS_NODE]: ipfsNodeContext,
  [CONTEXT.DDB_CLASS]: DDBContext,
  [CONTEXT.ENS_INSTANCE]: ensContext,
};

export default rootContext;
