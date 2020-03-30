import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import BigNumber from 'bn.js';

import { AnyTask, Payouts, EventType } from '~data/index';
import { AbbreviatedNumeral } from '~core/Numeral';
import PayoutsList from '~core/PayoutsList';
import { TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
  titleCommentCount: {
    id: 'dashboard.TaskList.TaskListItem.titleCommentCount',
    defaultMessage: `{formattedCommentCount} {commentCount, plural,
      one {comment}
      other {comments}
    }`,
  },
});

const UserAvatar = HookedUserAvatar();

interface Props {
  task: AnyTask;
}

const displayName = 'dashboard.TaskList.TaskListItem';

const TaskListItem = ({ task }: Props) => {
  const history = useHistory();
  const { formatMessage, formatNumber } = useIntl();

  const defaultTitle = formatMessage({ id: 'task.untitled' });
  const {
    id: draftId,
    assignedWorkerAddress,
    events,
    payouts,
    title = defaultTitle,
    colony: { colonyName, nativeTokenAddress },
  } = task;

  // @todo get reputation from centralized store
  let reputation: BigNumber | undefined;

  const handleClick = useCallback(() => {
    history.push({
      pathname: `/colony/${colonyName}/task/${draftId}`,
    });
  }, [colonyName, draftId, history]);

  const commentCount = useMemo<number>(
    () => events.filter(({ type }) => type === EventType.TaskMessage).length,
    [events],
  );

  return (
    <TableRow className={styles.globalLink} onClick={() => handleClick()}>
      <TableCell className={styles.taskDetails}>
        <div>
          <p className={styles.taskDetailsTitle}>{title || defaultTitle}</p>
        </div>
        {!!(reputation || commentCount) && (
          <div className={styles.extraInfo}>
            {!!reputation && (
              <div className={styles.extraInfoItem}>
                <span className={styles.taskDetailsReputation}>
                  <FormattedMessage
                    {...MSG.reputation}
                    values={{ reputation: reputation.toString() }}
                  />
                </span>
              </div>
            )}
            {commentCount && (
              <div className={styles.extraInfoItem}>
                <AbbreviatedNumeral
                  formatOptions={{
                    notation: 'compact',
                  }}
                  value={commentCount}
                  title={formatMessage(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: formatNumber(commentCount),
                  })}
                />
              </div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell className={styles.taskPayouts}>
        <PayoutsList
          nativeTokenAddress={nativeTokenAddress}
          payouts={payouts as Payouts}
        />
      </TableCell>
      <TableCell className={styles.userAvatar}>
        {assignedWorkerAddress && (
          <UserAvatar size="s" address={assignedWorkerAddress} />
        )}
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

export default TaskListItem;
