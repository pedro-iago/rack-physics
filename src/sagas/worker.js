import {take, put, call} from 'redux-saga';
import {spawn, init, subscribe, step, hydrate, terminate} from '../actions/worker';
import {SPAWN, INIT, SUBSCRIBE, STEP, HYDRATE, TERMINATE} from '../Macros';
import {QUEUE} from '../middleware/taskMiddleware';
import {message, broadcast} from '../api';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapvalues';

function* root( getState ){
  const getWorkers = () => getState().WorkReducer;
  const getObjects = () => getState().ViewReducer;
  const getTasks = () => getState().TaskReducer;
  yield [
    call(loopTasks, getWorkers, getTasks),
    call(loopCycle, getWorkers, getObjects)
  ];
}

function* loopTasks( getWorkers, getTasks ){
  while(true){
    yield take(QUEUE);
    const tasks = getTasks();
    for(const {type, payload} of tasks){switch(type){
      case SPAWN:  yield call(fetchSpawn, payload);  break;
      case INIT:  yield call(fetchInit, getWorkers(), payload);  break;
      case SUBSCRIBE:  yield call(fetchSubscribe, getWorkers(), payload);  break;
      case TERMINATE:  yield call(fetchTerminate, pick(getWorkers(), payload));  break;
    }};
  }
}

function* fetchSpawn( creators ){
  const workers = mapValues(creators, creator => creator());
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

function* fetchTerminate( workers ){
  for(const key in workers)
    workers[key].terminate();
  yield put( terminate(Object.keys(workers)) );
}

function* loopCycle( getWorkers, getObjects ){
  while(true){
    const [workers, objects] = [getWorkers(), getObjects()];
    yield call(fetchStep, workers);
    yield call(fetchHydrate, workers, objects);
  }
}

function* fetchStep( workers ){
  const {payload: objects} = yield call(broadcast, workers, {type: STEP});
  yield put( step(objects) );
}

function* fetchHydrate( workers, objects ){
  yield call(broadcast, workers, {type: HYDRATE, payload: objects});
  yield put( hydrate(objects) );
}

export default root;
