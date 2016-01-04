import {take, put, call, fork, join} from 'redux-saga';
import {SPAWN, INIT, SUBSCRIBE, STEP, TERMINATE} from '../Macros';
import {spawn, init, subscribe, step, terminate} from '../actions/worker';
import {message, broadcast} from '../api';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';

function* root( getState ){
  let pipeline = {};
  while( yield take() ){
    const {tasks} = getState();
    for(const task of tasks){
      const next = yield call(fetch, task, getState);
      if(!!pipeline.type) yield put(pipeline);
      pipeline = yield join(next || ( yield fork({}) ));
    }
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  switch(type){
    case SPAWN: return yield call(fetchSpawn, payload);
    case INIT: return yield fork(broadcast, workers, init(payload));
    case SUBSCRIBE: return yield fork(broadcast, workers, subscribe(payload));
    case STEP: return yield fork(broadcast, workers, step(payload));
    case TERMINATE: return yield call(fetchTerminate, pick(workers, payload));
  }
}

function* fetchSpawn( creators ){
  const workers = yield call(mapValues, creators, creator => creator());
  yield call(broadcast, workers, spawn());
  yield put(spawn(workers));
}

function* fetchTerminate( workers ){
  yield call(() => Object.values(workers).forEach((w) => w.terminate()));
  yield put(terminate(Object.keys(workers)));
}

export default root;
