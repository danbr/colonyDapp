/* @flow */

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import React, { useEffect, useMemo, useState } from 'react';

import type { PopoverTriggerType } from '~core/Popover';

import Popover from '~core/Popover';

import { usePrevious } from '~utils/hooks';

import type { TransactionOrMessageGroups } from './transactionGroup';

import { transactionCount } from './transactionGroup';
import GasStationContent from './GasStationContent';

type Props = {|
  transactionAndMessageGroups: TransactionOrMessageGroups,
  children: React$Element<*> | PopoverTriggerType,
|};

const GasStationPopover = ({
  children,
  transactionAndMessageGroups,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const txCount = useMemo(() => transactionCount(transactionAndMessageGroups), [
    transactionAndMessageGroups,
  ]);
  const prevTxCount = usePrevious(txCount);
  useEffect(
    () => {
      if (prevTxCount != null && txCount > prevTxCount) {
        setOpen(true);
      }
    },
    [txCount, prevTxCount],
  );

  return (
    <Popover
      appearance={{ theme: 'grey' }}
      content={({ close }) => (
        <GasStationContent
          transactionAndMessageGroups={transactionAndMessageGroups}
          close={close}
        />
      )}
      placement="bottom"
      showArrow={false}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
    >
      {children}
    </Popover>
  );
};

GasStationPopover.displayName = 'users.GasStation.GasStationPopover';

export default GasStationPopover;
