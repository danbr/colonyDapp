/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { all } from 'redux-saga/effects';

import context from '~context/';

import userReducer from './modules/user/reducers';

import dashboardSagas from './modules/dashboard/sagas';
import coreSagas from './modules/core/sagas';
import userSagas from './modules/user/sagas';
import history from './history';
import { dataReducer, dataSagas, initializeData } from './data';

import reduxPromiseListener from './createPromiseListener';

const rootReducer = combineReducers({
  user: userReducer,
  data: dataReducer,
});

function* rootSaga(): any {
  yield all([userSagas(), dashboardSagas(), coreSagas(), dataSagas()]);
}

const sagaMiddleware = createSagaMiddleware({ context });

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      reduxPromiseListener.middleware,
    ),
  ),
);

sagaMiddleware.run(rootSaga);

// TODO this action should be run upon login
const rootRepo = '/tmp/dataTests';
initializeData(store.dispatch, rootRepo);

export default store;
