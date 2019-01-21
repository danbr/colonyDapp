/* @flow */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import context from '~context';

import adminReducer from './modules/admin/reducers';
import coreReducer from './modules/core/reducers';
import dashboardReducer from './modules/dashboard/reducers';
import userReducer from './modules/users/reducers';

import setupSagas from './modules/core/sagas';
import history from './history';

import reduxPromiseListener from './createPromiseListener';

const rootReducer = combineReducers({
  admin: adminReducer,
  core: coreReducer,
  dashboard: dashboardReducer,
  users: userReducer,
});

const sagaMiddleware = createSagaMiddleware({ context });

const composeEnhancer: Function =
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      // $FlowFixMe flow-typed errors
      sagaMiddleware,
      reduxPromiseListener.middleware,
    ),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
