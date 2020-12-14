import { all, call } from 'redux-saga/effects';

import rolesSagas from './roles';
import actionSagas from './actions';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import domainsSagas from './domains';
import taskSagas from './task';
import tokenSagas from './token';

export default function* setupDashboardSagas() {
  yield all([
    call(rolesSagas),
    call(actionSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(domainsSagas),
    call(taskSagas),
    call(tokenSagas),
  ]);
}
