import { Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';
import { ActionTypes, ReducerType } from '~redux/index';
import {
  DataRecord,
  DataRecordType,
  CurrentUserTasksType,
} from '~immutable/index';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserTasksType>;

const currentUserTasksReducer: ReducerType<State> = (
  state = DataRecord<CurrentUserTasksType>(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_TASK_SUBSCRIBE_SUCCESS: {
      const { colonyAddress, draftId } = action.payload;
      const entry: [Address, string] = [colonyAddress, draftId];
      return state.merge({
        error: undefined,
        record: state.record ? state.record.add(entry) : ImmutableSet([entry]),
        isFetching: false,
      });
    }
    case ActionTypes.USER_LOGOUT_SUCCESS: {
      return state.merge({
        error: undefined,
        record: undefined,
        isFetching: false,
      });
    }
    case ActionTypes.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: {
      const record = ImmutableSet(action.payload);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    default:
      return state;
  }
};

export default withDataRecord<State>(
  new Set([
    ActionTypes.USER_SUBSCRIBED_TASKS_FETCH,
    ActionTypes.USER_SUBSCRIBED_TASKS_SUB_START,
  ]),
)(currentUserTasksReducer);