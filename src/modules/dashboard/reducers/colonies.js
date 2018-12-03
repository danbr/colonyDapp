/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_FETCH_SUCCESS } from '../actionTypes';

import { Colony, Token } from '~immutable';

import type { Action, ENSName } from '~types';

// TODO consider adding loading/error state, perhaps with a generalised
// higher order reducer (so we can use this pattern elsewhere).
type State = ImmutableMap<ENSName, Colony>;

const INITIAL_STATE: State = new ImmutableMap();

const coloniesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        colonyStoreData: { ensName, token, ...colonyStoreData },
      } = action.payload;
      return state.set(
        ensName,
        Colony({
          ensName,
          token: Token(token),
          ...colonyStoreData,
        }),
      );
    }
    default:
      return state;
  }
};

export default coloniesReducer;
