import {take, put, call, fork, join} from 'redux-saga';
import {SPAWN, SETUP, LOOP, TERMINATE} from '../Macros';
import {spawn, setup, loop, terminate} from '../actions/worker';
import {message, broadcast} from '../api';
import {Vec3, Quat} from '../utils/VectorUtils';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';

function* root( getState ){
  let pipeline = {};
  while(true){
    const tasks = yield take();
    for(const task of tasks){
      const next = yield call(fetch, task, getState);
      if(pipeline.meta && !!pipeline.meta.length)
        yield put(pipeline);
      pipeline = yield join(next || ( yield fork({}) ));
    }
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  switch(type){
    case SPAWN: return yield call(fetchSpawn, payload);
    case SETUP: return yield fork(broadcast, workers, setup(toJSON(payload)));
    case LOOP: return yield fork(broadcast, workers, loop(objects));
    case TERMINATE: return yield call(fetchTerminate, pick(workers, payload));
  }
}

function* fetchSpawn( creators ){
  const workers = yield call(mapValues, creators, creator => creator());
  yield put(spawn(workers));
}

function* fetchTerminate( workers ){
  yield call(() => Object.values(workers).forEach((w) => w.terminate()));
  yield put(terminate(Object.keys(workers)));
}

function toJSON( view ){
  return mapValues(view, object => {
    const pos = Vec3.scale(object.position, 1);
    const qua = Quat.scale(object.quaternion, 1);
    const {name, ...physics} = object.userData.rack;
    const mesh = object.getObjectByName(name);
    if(mesh){
      var dynamic = mesh.geometry.dynamic;
      var visible = mesh.visible;
    }
    return { ...physics, visible, dynamic, pos, qua };
  })
}

export default root;
