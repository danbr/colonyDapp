import React, { useState, useMemo, ReactElement } from 'react';
import { nanoid } from 'nanoid';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';

import { getEventsForActions } from '~utils/events';

import {
  useTransactionMessagesQuery,
  ParsedEvent,
  AnyUser,
  OneDomain,
  ColonyAction,
} from '~data/index';
import { ColonyActions } from '~types/index';

import ActionsPageFeedItem from './ActionsPageFeedItem';
import ActionsPageEvent from './ActionsPageEvent';

import styles from './ActionsPageFeed.css';

const displayName = 'dashboard.ActionsPageFeed';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.ActionsPageFeed.loading',
    defaultMessage: 'Loading action page feed',
  },
});

export interface EventValues {
  actionType: string;
  amount: string | ReactElement;
  tokenSymbol: string | ReactElement;
  decimals: number;
  fromDomain: OneDomain;
  toDomain: OneDomain;
  oldVersion: string;
  newVersion: string;
  colonyName: string | ReactElement;
}

interface Props {
  transactionHash: string;
  networkEvents?: ParsedEvent[];
  recipient?: AnyUser;
  values?: EventValues;
  actionType?: string;
  actionData: ColonyAction;
}

const ActionsPageFeed = ({
  transactionHash,
  networkEvents,
  values,
  actionType,
  actionData,
}: Props) => {
  const [autogeneratedIds] = useState<string[]>(
    [...new Array(networkEvents?.length)].map(nanoid),
  );

  const { data, loading, error } = useTransactionMessagesQuery({
    variables: { transactionHash },
  });

  const filteredEvents = useMemo(() => {
    if (networkEvents) {
      return getEventsForActions(networkEvents, actionType as ColonyActions);
    }
    return [];
  }, [actionType, networkEvents]);

  if (error) {
    return null;
  }

  if (loading || !data?.transactionMessages) {
    return (
      <div className={styles.loading}>
        <SpinnerLoader />
        <span className={styles.loaderMessage}>
          <FormattedMessage {...MSG.loading} />
        </span>
      </div>
    );
  }

  /*
   * @NOTE At least for now we don't actually need to merge the events and
   * comments list, as they will always be separated.
   *
   * The events will always appear at the top of the feed, having the initial
   * transaction's block time.
   *
   * And, while comments can only be made after the transaction has mined, they
   * will always appear after.
   *
   * Doing it like this is simpler, and safer. At least for now.
   */
  return (
    <ul className={styles.main}>
      {filteredEvents.map(({ name, createdAt, emmitedBy }, index) => (
        <li key={autogeneratedIds[index]}>
          <ActionsPageEvent
            createdAt={new Date(createdAt)}
            transactionHash={transactionHash}
            eventName={name}
            actionData={actionData}
            values={values}
            emmitedBy={emmitedBy}
          />
        </li>
      ))}
      {data?.transactionMessages.messages.map(
        ({
          initiator: messageInitiator,
          createdAt,
          sourceId,
          context: { message },
        }) => (
          <li key={sourceId}>
            <ActionsPageFeedItem
              createdAt={createdAt}
              comment={message}
              user={messageInitiator}
            />
          </li>
        ),
      )}
    </ul>
  );
};

ActionsPageFeed.displayName = displayName;

export default ActionsPageFeed;
