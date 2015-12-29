import { SPAWN, TERMINATE } from '../Macros';
import omit from 'lodash.omit';

const initial = {};
function WorkReducer(state = initial, action) {
  const {type, payload} = action;
  switch (type) {
    case SPAWN:
      return {...state, ...payload};
    case TERMINATE:
      return omit(state, payload);
    default:
      return state;
  }
};

export default WorkReducer;
