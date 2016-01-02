export default store => next => action => {
  const result = next(queue(action));
  return result;
}

//this should be only temporary here! hopefully he will accept my pull request
export function batchedSubscribePR(batch) {
  const listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }
  function notifyListenersBatched(...dispatchArgs) {
    batch(() => listeners.slice().forEach(listener => listener()), ...dispatchArgs);
  }
  return next => (...args) => {
    const store = next(...args);
    const subscribeImmediate = store.subscribe;

    function dispatch(...dispatchArgs) {
      const res = store.dispatch(...dispatchArgs);
      notifyListenersBatched(...dispatchArgs);
      return res;
    }
    return {
      ...store,
      dispatch,
      subscribe,
      subscribeImmediate
    };
  };
}

export const QUEUE = 'QUEUE';
export function queue( task ){
  return {
    type: QUEUE,
    payload: task
  };
};

const initial = [];
export function TaskReducer(state = initial, action) {
  const {type, payload: task} = action;
  const first = state.length? state[0] : undefined;
  const last = state.length? state[state.length - 1] : undefined;
  switch (type) {
    case QUEUE:
      if(last && last.type === task.type)
        return state.slice(0,-1).concat(mergeTask(last, task));
      else
        return state.concat(task);
    default:
      if(first && first.type === type)
        return state.slice(1);
      else
        return state;
  }
};

function mergeTask(taskA, taskB){
  const type = taskA.type;
  const meta = merge(taskA.meta, taskB.meta);
  const payload = merge(taskA.payload, taskB.payload);
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
