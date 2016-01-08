import {createStore} from 'redux';
import sagaMiddleware from 'redux-saga';

const QUEUE = 'QUEUE';
function queue(action){
  return {
    type: QUEUE,
    payload: action
  };
}

const DEQUEUE = 'DEQUEUE';
function dequeue(){
  return {
    type: DEQUEUE
  };
}

function TaskReducerWith(queuer = (arr, el) => arr.concat(el)){
  return (state = [], task) => {  //maybe using a Ordered Map could be more appropriate?
    const {type, payload: action} = task;
    switch (type) {
      case QUEUE:
        return queuer(state, action);
      case DEQUEUE:
        return state.slice(1);
      default:
        return state;
    }
  };
}

function liftStoreWith(store, sagas, TaskReducer) {
  const liftedStore = createStore(TaskReducer);
  const dispatch = (action) => {
    store.dispatch(action);
    liftedStore.dispatch(dequeue());
  }
  const report = sagaMiddleware(...sagas)({...store, dispatch})(() => {});
  const post = (action) => {
    liftedStore.dispatch(queue(action));
    report(liftedStore.getState());
  }
  return {
    ...store,
    dispatch: post
  };
}

export default function taskEnhancer(hashSagas) {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const TaskReducer = TaskReducerWith(queuer);
    const liftedStore = liftStoreWith(store, Object.values(hashSagas), TaskReducer);
    return liftedStore;
  };
}

function queuer(state, action){
  const last = state.length? state[state.length - 1] : undefined;
  if(last && last.type === action.type)
    return state.slice(0,-1).concat(mergeAction(last, action));
  else
    return state.concat(action);
}

function mergeAction(actionA, actionB){
  const type = actionA.type;
  const meta = merge(actionA.meta, actionB.meta);
  const payload = merge(actionA.payload, actionB.payload);
  if(meta)
    return {type, meta, payload};
  else
    return {type, payload};
}

function merge(a, b){
  return typeof(a) === 'undefined'? undefined
         : a.prototype === Array? a.concat(b.payload)
         : typeof(a) === 'object'? {...a, ...b}
         : [a, b];
}
