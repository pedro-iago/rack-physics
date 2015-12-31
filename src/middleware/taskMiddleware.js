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

export default store => next => action => {
  const result = next(queue(action));
  return result;
}
