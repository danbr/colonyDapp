/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserMention from '~core/UserMention';
import MaskedAddress from '~core/MaskedAddress';
import Button from '~core/Button';
import { useDataSubscriber } from '~utils/hooks';
import { userSubscriber } from '../../../users/subscribers';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './UserListItem.css';

import type { ColonyAdminType, UserType } from '~immutable';
import type { Address } from '~types';

const MSG = defineMessages({
  buttonRemove: {
    id: 'admin.UserList.UserListItem.buttonRemove',
    defaultMessage: 'Remove',
  },
  pending: {
    id: 'admin.UserList.UserListItem.pending',
    defaultMessage: 'Transaction pending',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'admin.UserList.UserListItem';

type Props = {|
  /*
   * User address
   */
  address: Address,
  /*
   * Whether to show the fullname
   */
  showDisplayName?: boolean,
  /*
   * Whether to show the username
   */
  showUsername?: boolean,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   */
  showMaskedAddress?: boolean,
  /*
   * Whether to show the remove button
   */
  viewOnly: boolean,
  /*
   * Method to call when clicking the remove button
   * Gets passed down to `UserListItem`
   */
  onRemove: ColonyAdminType => any,
|};

const UserListItem = ({
  address,
  showDisplayName = false,
  showUsername = false,
  showMaskedAddress = false,
  viewOnly = true,
  onRemove,
}: Props) => {
  const { data: user } = useDataSubscriber<UserType>(
    userSubscriber,
    [address],
    [address],
  );

  const { profile: { username, displayName } = {} } = user || {};
  return (
    <TableRow className={styles.main}>
      <TableCell className={styles.userAvatar}>
        <UserAvatar size="xs" address={address} user={user} />
      </TableCell>
      <TableCell className={styles.userDetails}>
        {showDisplayName && displayName && (
          <span className={styles.displayName} title={displayName}>
            {displayName}
          </span>
        )}
        {showUsername && username && (
          <span className={styles.username}>
            <UserMention hasLink={false} username={username} />
          </span>
        )}
        <span className={styles.address}>
          {showMaskedAddress ? (
            <MaskedAddress address={address} />
          ) : (
            <span>{address}</span>
          )}
        </span>
      </TableCell>
      <TableCell className={styles.userRemove}>
        {!viewOnly && (
          <Button
            className={styles.customRemoveButton}
            appearance={{ theme: 'primary' }}
            text={MSG.buttonRemove}
            onClick={onRemove}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

UserListItem.displayName = componentDisplayName;

export default UserListItem;
