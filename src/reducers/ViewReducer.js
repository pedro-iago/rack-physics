import { SUBSCRIBE, STEP } from '../Macros';

const initial = {};
function ViewReducer(state = initial, action) {
  const {type, payload} = action;
  switch (type) {
    case SUBSCRIBE:
    case STEP:
      let newState = {};
      for(const key in payload){
        newState[key] = {...state[key], ...payload[key]};
      }
      return {...state, ...newState};
    default:
      return state;
  }
};

export default ViewReducer;
