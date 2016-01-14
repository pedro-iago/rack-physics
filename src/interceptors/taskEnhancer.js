import {createStore} from 'redux';
import sagaMiddleware from 'redux-saga';

//this monkey-patching is a bit shady..
//my intent is to queue each action from the View to the TaskReducer
//and pass its state on the take of redux-saga, which will them dispatch the real action
function liftStoreWith(store, sagas, TaskReducer) {
  const liftedStore = createStore(TaskReducer);
  //the dispatch method for redux-saga is the actual store dispatch, with adtion to a dequeue to the lifted store
  const dispatch = (action) => {
    store.dispatch(action);
    liftedStore.dispatch(dequeue());
  }
  const report = sagaMiddleware(...sagas)({...store, dispatch})(() => {});
  //note that post doesn't go to the actual store, it goes instead to the lifted one (TaskReducer)
  //at the same time post reports the TaskQueue to the take of redux-sage, so it can run the effects
  const post = (action) => {
    liftedStore.dispatch(queue(action));
    report(liftedStore.getState());
  }
  return {
    ...store,
    dispatch: post
  };
}

//my idea was to bind the actual dispatch to redux-saga, and return a dispatch to a lifted store to the View
//redux saga would them subscribe to lifted actions and take the Queue from them.. while still geting the actual state.
export default function taskEnhancer(hashSagas) {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const TaskReducer = TaskReducerWith(queuer);
    const liftedStore = liftStoreWith(store, Object.values(hashSagas), TaskReducer);
    return liftedStore;
  };
}

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

//Consider giving priority to SPAWN over SETUP or maybe just using a Ordered Map and let user handle execution order
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
