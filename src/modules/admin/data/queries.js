/* @flow */

import type { Address } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  Query,
} from '~data/types';

import {
  getLogsAndEvents,
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parseTaskPayoutClaimedEvent,
  parseUnclaimedTransferEvent,
} from '~utils/web3/eventLogs';

import type { ContractTransactionType } from '~immutable';

type ColonyMetadata = {|
  colonyAddress: Address,
|};

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;

export type ColonyContractTransactionsEventQuery<I: *, R: *> = Query<
  ContextWithMetadata<ColonyMetadata, ColonyClientContext>,
  I,
  R,
>;

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
};

export const getColonyTransactions: ColonyContractTransactionsEventQuery<
  void,
  ContractTransactionType[],
> = ({
  metadata: { colonyAddress },
  colonyClient: {
    events: {
      ColonyFundsClaimed,
      ColonyFundsMovedBetweenFundingPots,
      TaskPayoutClaimed,
    },
  },
  colonyClient,
}) => ({
  async execute() {
    const { events, logs } = await getLogsAndEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          ColonyFundsClaimed,
          ColonyFundsMovedBetweenFundingPots,
          TaskPayoutClaimed,
        ],
      },
    );
    return Promise.all(
      events
        .map((event, i) =>
          EVENT_PARSERS[event.eventName]({
            event,
            log: logs[i],
            colonyClient,
            colonyAddress,
          }),
        )
        .filter(Boolean),
    );
  },
});

export const getColonyUnclaimedTransactions: ColonyContractTransactionsEventQuery<
  void,
  ContractTransactionType[],
> = ({
  metadata: { colonyAddress },
  colonyClient: {
    events: { ColonyFundsClaimed },
    tokenClient: {
      events: { Transfer },
    },
    tokenClient,
  },
  colonyClient,
}) => ({
  async execute() {
    const blocksBack = 400000;

    // Get logs & events for token transfer to this colony
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      {},
      { blocksBack, events: [Transfer], to: colonyAddress },
    );

    // Get logs & events for token claims by this colony
    const { logs: claimLogs, events: claimEvents } = await getLogsAndEvents(
      colonyClient,
      {},
      { blocksBack, events: [ColonyFundsClaimed] },
    );

    const unclaimedTransfers = await Promise.all(
      transferEvents.map((transferEvent, i) =>
        parseUnclaimedTransferEvent({
          claimEvents,
          claimLogs,
          colonyClient,
          colonyAddress,
          transferEvent,
          transferLog: transferLogs[i],
        }),
      ),
    );

    return unclaimedTransfers.filter(Boolean);
  },
});
