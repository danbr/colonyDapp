import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import {
  ColonyTokenEditDialog,
  TokenMintDialog,
  TokensMoveDialog,
} from '~admin/Tokens';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

import styles from './ColonyFundingMenu.css';

const MSG = defineMessages({
  navItemMoveTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemMoveTokens',
    defaultMessage: 'Move funds',
  },
  navItemMintNewTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemMintNewTokens',
    defaultMessage: 'Mint tokens',
  },
  navItemManageTokens: {
    id: 'dashboard.ColonyFundingMenu.navItemManageTokens',
    defaultMessage: 'Manage tokens',
  },
});

interface Props {
  colony: Colony;
  selectedDomainId: number;
}

const displayName = 'dashboard.ColonyFundingMenu';

const ColonyFundingMenu = ({
  colony: { colonyAddress, canMintNativeToken, nativeTokenAddress, tokens },
  colony,
  selectedDomainId,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const openTokenEditDialog = useDialog(ColonyTokenEditDialog);
  const openTokenMintDialog = useDialog(TokenMintDialog);
  const openTokensMoveDialog = useDialog(TokensMoveDialog);

  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const canEdit =
    userHasRole(rootRoles, ColonyRole.Root) ||
    userHasRole(rootRoles, ColonyRole.Administration);
  const canMoveTokens = userHasRole(rootRoles, ColonyRole.Funding);

  const handleEditTokens = useCallback(
    () =>
      openTokenEditDialog({
        colonyAddress,
      }),
    [openTokenEditDialog, colonyAddress],
  );
  const handleMintTokens = useCallback(() => {
    const nativeToken =
      tokens && tokens.find(({ address }) => address === nativeTokenAddress);
    if (nativeToken) {
      openTokenMintDialog({
        nativeToken,
        colonyAddress,
      });
    }
  }, [colonyAddress, nativeTokenAddress, openTokenMintDialog, tokens]);
  const handleMoveTokens = useCallback(
    () =>
      openTokensMoveDialog({
        colonyAddress,
        toDomain: selectedDomainId,
      }),
    [colonyAddress, openTokensMoveDialog, selectedDomainId],
  );

  return (
    <ul className={styles.main}>
      {canMoveTokens && (
        <li>
          <Button
            text={MSG.navItemMoveTokens}
            appearance={{ theme: 'blue' }}
            onClick={handleMoveTokens}
          />
        </li>
      )}
      {canMintNativeToken && (
        <li>
          <Button
            text={MSG.navItemMintNewTokens}
            appearance={{ theme: 'blue' }}
            onClick={handleMintTokens}
          />
        </li>
      )}
      {canEdit && (
        <li>
          <Button
            text={MSG.navItemManageTokens}
            appearance={{ theme: 'blue' }}
            onClick={handleEditTokens}
          />
        </li>
      )}
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
