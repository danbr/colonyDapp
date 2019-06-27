/* @flow */

import BigNumber from 'bn.js';

import type { Action } from '~redux';
import type { TransactionReceipt } from '~types';
import type {
  GasPricesProps,
  TransactionError,
  TransactionMultisig,
} from '~immutable';

import { ACTIONS } from '~redux';
import { TRANSACTION_STATUSES, TRANSACTION_ERRORS } from '~immutable';

import type { TxConfig } from '../types';

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxAction = (
  id: string,
  from: string,
  {
    context,
    group,
    identifier,
    methodContext,
    methodName,
    multisig: multisigConfig,
    options,
    params,
    ready,
  }: TxConfig,
) => ({
  type: multisigConfig
    ? ACTIONS.MULTISIG_TRANSACTION_CREATED
    : ACTIONS.TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodContext,
    methodName,
    multisig: typeof multisigConfig == 'boolean' ? {} : multisigConfig,
    options,
    params,
    status:
      ready === false
        ? TRANSACTION_STATUSES.CREATED
        : TRANSACTION_STATUSES.READY,
  },
  meta: { id },
});

const transactionError = (
  type: $PropertyType<TransactionError, 'type'>,
  id: string,
  error: Error,
): Action<typeof ACTIONS.TRANSACTION_ERROR> => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: {
    error: {
      type,
      message: error.message || error.toString(),
    },
  },
  error: true,
  meta: { id },
});

export const transactionEstimateError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.ESTIMATE,
);

export const transactionEventDataError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.EVENT_DATA,
);

export const transactionReceiptError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.RECEIPT,
);

export const transactionSendError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.SEND,
);

export const transactionUnsuccessfulError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.UNSUCCESSFUL,
);

export const multisigTransactionRefreshError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_REFRESH,
);

export const multisigTransactionNonceError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_NONCE,
);

export const multisigTransactionSignError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_SIGN,
);

export const multisigTransactionRejectError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_REJECT,
);

export const multisigTransactionRefreshed = (
  id: string,
  multisig: TransactionMultisig,
): Action<typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED> => ({
  type: ACTIONS.MULTISIG_TRANSACTION_REFRESHED,
  payload: { multisig },
  meta: { id },
});

export const multisigTransactionSign = (
  id: string,
): Action<typeof ACTIONS.MULTISIG_TRANSACTION_SIGN> => ({
  type: ACTIONS.MULTISIG_TRANSACTION_SIGN,
  meta: { id },
});

export const multisigTransactionSigned = (
  id: string,
): Action<typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED> => ({
  type: ACTIONS.MULTISIG_TRANSACTION_SIGNED,
  meta: { id },
});

export const multisigTransactionReject = (
  id: string,
): Action<typeof ACTIONS.MULTISIG_TRANSACTION_REJECT> => ({
  type: ACTIONS.MULTISIG_TRANSACTION_REJECT,
  meta: { id },
});

export const transactionReceiptReceived = (
  id: string,
  payload: {| receipt: TransactionReceipt, params: Object |},
): Action<typeof ACTIONS.TRANSACTION_RECEIPT_RECEIVED> => ({
  type: ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSend = (
  id: string,
): Action<typeof ACTIONS.TRANSACTION_SEND> => ({
  type: ACTIONS.TRANSACTION_SEND,
  meta: { id },
});

export const transactionSent = (
  id: string,
  payload: {| hash: string, params: Object |},
): Action<typeof ACTIONS.TRANSACTION_SENT> => ({
  type: ACTIONS.TRANSACTION_SENT,
  payload,
  meta: { id },
});

export const transactionSucceeded = (
  id: string,
  payload: {| eventData: Object, params: Object |},
): Action<typeof ACTIONS.TRANSACTION_SUCCEEDED> => ({
  type: ACTIONS.TRANSACTION_SUCCEEDED,
  payload,
  meta: { id },
});

export const transactionAddIdentifier = (
  id: string,
  identifier: string,
): Action<typeof ACTIONS.TRANSACTION_ADD_IDENTIFIER> => ({
  type: ACTIONS.TRANSACTION_ADD_IDENTIFIER,
  meta: { id },
  payload: { identifier },
});

export const transactionAddParams = (
  id: string,
  params: Object,
): Action<typeof ACTIONS.TRANSACTION_ADD_PARAMS> => ({
  type: ACTIONS.TRANSACTION_ADD_PARAMS,
  meta: { id },
  payload: { params },
});

export const transactionReady = (
  id: string,
): Action<typeof ACTIONS.TRANSACTION_READY> => ({
  type: ACTIONS.TRANSACTION_READY,
  meta: { id },
});

export const transactionEstimateGas = (
  id: string,
): Action<typeof ACTIONS.TRANSACTION_ESTIMATE_GAS> => ({
  type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
  meta: { id },
});

export const transactionUpdateGas = (
  id: string,
  data: {| gasLimit?: BigNumber, gasPrice?: BigNumber |},
): Action<typeof ACTIONS.TRANSACTION_GAS_UPDATE> => ({
  type: ACTIONS.TRANSACTION_GAS_UPDATE,
  payload: data,
  meta: { id },
});

export const transactionCancel = (
  id: string,
): Action<typeof ACTIONS.TRANSACTION_CANCEL> => ({
  type: ACTIONS.TRANSACTION_CANCEL,
  meta: { id },
});

export const updateGasPrices = (
  gasPrices: GasPricesProps,
): Action<typeof ACTIONS.GAS_PRICES_UPDATE> => ({
  type: ACTIONS.GAS_PRICES_UPDATE,
  payload: gasPrices,
});
