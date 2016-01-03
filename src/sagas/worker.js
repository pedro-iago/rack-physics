import {take, put, call, fork, join} from 'redux-saga';
import {SPAWN, INIT, SUBSCRIBE, STEP, TERMINATE} from '../Macros';
import {spawn, init, subscribe, step, terminate} from '../actions/worker';
import {QUEUE} from '../middleware/taskMiddleware';
import {message, broadcast} from '../api';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';

let pipeline = {};
function* root( getState ){
  while( yield take(QUEUE) ){
    const {TaskReducer: tasks} = getState();
    for(const task of tasks){
      const next = yield call(fetch, task, getState);
      yield put(pipeline);
      pipeline = yield join(next || ( yield fork({}) ));
    }
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  switch(type){
    case SPAWN: return yield call(fetchSpawn, payload);
    case INIT: return yield call(fetchInit, workers, payload);
    case SUBSCRIBE: return yield call(fetchSubscribe, workers, payload);
    case STEP: return yield call(fetchStep, workers, objects);
    case TERMINATE: return yield call(fetchTerminate, pick(workers, payload));
  }
}

function* fetchSpawn( creators ){
  const workers = yield call(mapValues, creators, creator => creator());
  yield call(broadcast, workers, spawn());
  yield put(spawn(workers));
}

function* fetchInit( workers, settings ){
  return yield fork(broadcast, workers, init(settings));
}

function* fetchSubscribe( workers, objects ){
  return yield fork(broadcast, workers, subscribe(objects));
}

function* fetchStep( workers, objects ){
  return yield fork(broadcast, workers, step(objects));
}

function* fetchTerminate( workers ){
  Object.values(workers).forEach((worker) => worker.terminate());
  yield put(terminate(Object.keys(workers)));
}

export default root;
