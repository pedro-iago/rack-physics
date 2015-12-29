import { SUBSCRIBE, STEP } from '../Macros';

const initial = {};
function ViewReducer(state = initial, action) {
  const {type, payload} = action;
  switch (type) {
    case SUBSCRIBE:
    case STEP:
      return {...state, ...payload};
    default:
      return state;
  }
};

export default ViewReducer;
