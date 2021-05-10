import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getMoveFundsPermissionProofs } from '@colony/colony-js';
import { AddressZero, MaxUint256 } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

function* moveFundsMotion({
  payload: {
    colonyAddress,
    colonyName,
    fromDomainId,
    toDomainId,
    amount,
    tokenAddress,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_MOTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!fromDomainId) {
      throw new Error(
        'Source domain not set for oveFundsBetweenPots transaction',
      );
    }
    if (!toDomainId) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [{ fundingPotId: fromPot }, { fundingPotId: toPot }] = yield all([
      call([colonyClient, colonyClient.getDomain], fromDomainId),
      call([colonyClient, colonyClient.getDomain], toDomainId),
    ]);

    const [
      permissionDomainId,
      fromChildSkillIndex,
      toChildSkillIndex,
    ] = yield call(getMoveFundsPermissionProofs, colonyClient, fromPot, toPot);

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      fromDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createDomainMotion';

    const {
      createDomainMotion,
      annotateMoveFundsMotion,
    } = yield createTransactionChannels(metaId, [
      'createDomainMotion',
      'annotateMoveFundsMotion',
    ]);

    // eslint-disable-next-line max-len
    const encodedAction = colonyClient.interface.functions.moveFundsBetweenPots.encode(
      [
        permissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        fromPot,
        toPot,
        amount,
        tokenAddress,
      ],
    );

    // create transactions
    yield fork(createTransaction, createDomainMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createDomainMotion',
      identifier: colonyAddress,
      params: [
        fromDomainId,
        MaxUint256.toString(),
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFundsMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createDomainMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFundsMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    let ipfsHash = null;
    ipfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        annotationMessage,
      }),
    );

    yield put(transactionReady(createDomainMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createDomainMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(
      createDomainMotion.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (annotationMessage) {
      yield put(transactionPending(annotateMoveFundsMotion.id));

      yield put(
        transactionAddParams(annotateMoveFundsMotion.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateMoveFundsMotion.id));

      yield takeFrom(
        annotateMoveFundsMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.COLONY_MOTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsMotionSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_MOVE_FUNDS, moveFundsMotion);
}