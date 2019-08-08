/* @flow */

import type { Event } from '../types';
import { VERSION } from '../constants';

export const CONTRACT_EVENT_SOURCE = 'contract';
export const DDB_EVENT_SOURCE = 'ddb';

opaque type EVENT_SOURCE_TYPE = 'contract' | 'ddb';

type NormalizedEvent = {|
  type: string, // Event type a.k.a event name
  payload: Object, // Orbit-db entry payload value or parsed tx log topics
  meta: {|
    id: string, // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string, // Orbit store address or contract address
    sourceType: EVENT_SOURCE_TYPE, // See above
    actorId: string, // Wallet address for orbit-db events or tx sender address for tx logs
    timestamp: number,
    version: typeof VERSION,
  |},
|};

type TransactionLog = {|
  event: { eventName: string },
  log: {
    logIndex: number,
    transactionHash: string,
  },
  timestamp: number,
  transaction: {
    from: string,
  },
|};

export const normalizeDDBStoreEvent = (
  storeAddress: string,
  { meta: { timestamp, id, userAddress }, payload, type }: Event<*>,
): NormalizedEvent => ({
  type,
  payload,
  meta: {
    id,
    sourceType: DDB_EVENT_SOURCE,
    sourceId: storeAddress,
    actorId: userAddress,
    timestamp,
    version: VERSION,
  },
});

export const normalizeTransactionLog = (
  contractAddress: string,
  {
    event: { eventName, ...event },
    log: { logIndex, transactionHash },
    timestamp,
    transaction: { from },
  }: TransactionLog,
): NormalizedEvent => ({
  type: eventName,
  payload: event,
  meta: {
    id: `${transactionHash}_${logIndex}`,
    sourceType: CONTRACT_EVENT_SOURCE,
    sourceId: contractAddress,
    actorId: from,
    timestamp,
    version: VERSION,
  },
});

export const normalizeEvent = (
  eventSourceType: string,
): ((
  eventSourceId: string,
  data: TransactionLog | Event<*>,
) => NormalizedEvent) =>
  ({
    CONTRACT_EVENT_SOURCE: normalizeTransactionLog,
    DDB_EVENT_SOURCE: normalizeDDBStoreEvent,
  }[eventSourceType]);
