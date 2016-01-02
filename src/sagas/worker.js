import {take, put, call} from 'redux-saga';
import {spawn, init, subscribe, step, terminate} from '../actions/worker';
import {SPAWN, INIT, SUBSCRIBE, STEP, TERMINATE} from '../Macros';
import {QUEUE} from '../middleware/taskMiddleware';
import {message, broadcast} from '../api';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapvalues';

function* root( getState ){
  while( yield take(QUEUE) ){
    const {TaskReducer: tasks} = getState();
    for(const task of tasks)
      yield call(fetch, task, getState);
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  switch(type){
    case SPAWN:  yield call(fetchSpawn, payload);  break;
    case INIT:  yield call(fetchInit, workers, payload);  break;
    case SUBSCRIBE:  yield call(fetchSubscribe, workers, payload);  break;
    case STEP:  yield call(fetchStep, workers, objects);  break;
    case TERMINATE:  yield call(fetchTerminate, pick(workers, payload));  break;
  }
}

function* fetchSpawn( creators ){
  const workers = yield call(mapValues, creators, creator => creator());
  for(const key in workers)
    yield call(message, workers[key], {type: SPAWN, meta: key});
  yield put( spawn(workers) );
}

function* fetchInit( workers, settings ){
  yield call(broadcast, workers, {type: INIT, payload: settings});
  yield put( init(settings) );
}

function* fetchSubscribe( workers, objects ){
  yield call(broadcast, workers, {type: SUBSCRIBE, payload: objects});
  yield put( subscribe(objects) );
}

function* fetchStep( workers, objects ){
  const {payload: nextObjects} = yield call(broadcast, workers, {type: STEP, payload: objects});
  yield put( step(nextObjects) );
  //console.log("step");
}

function* fetchTerminate( workers ){
  for(const key in workers)
    yield call(() => workers[key].terminate());
  yield put( terminate(Object.keys(workers)) );
}

export default root;
