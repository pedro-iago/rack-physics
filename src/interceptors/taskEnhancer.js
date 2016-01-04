import sagaMiddleware from 'redux-saga';

export default function taskEnhancer(hashSagas){
  var tasks = [];
  const post = (action) => tasks = queuer(tasks, action);
  const resolve = () => tasks = tasks.slice(1);
  const sagas = Object.values(hashSagas);
  return (next) => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const getState = () => ({ ...store.getState(), tasks });
    const dispatch = sagaMiddleware(...sagas)({dispatch: store.dispatch, getState})(post);
    store.subscribe(resolve);
    return { ...store, getState, dispatch };
  }
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
