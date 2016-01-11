import {take, put, call, fork, join} from 'redux-saga';
import {SPAWN, SETUP, LOOP, TERMINATE} from '../Macros';
import {spawn, setup, loop, terminate} from '../actions/worker';
import {message, broadcast} from '../api';
import {Vec3, Quat} from '../utils/VectorUtils';
import THREE from 'three.js';
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
    var position = new THREE.Vector3();
    position.setFromMatrixPosition( object.matrixWorld );
    var quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix( object.matrixWorld );
    const pos = Vec3.scale(position, 1);
    const qua = Quat.scale(quaternion, 1);
    const {name, ...physics} = object.userData.rack;
    const mesh = object.getObjectByName(name);
    if(mesh){
      var dynamic = mesh.geometry.dynamic;
      var visible = mesh.visible;
    }
    return { ...physics, visible, dynamic, pos, qua };
  })
}

// just need to hold a reference and use it here
// function toLocal( world ){
//   const {pos, qua, ...rest} = world;
//   var position = new THREE.Vector3();
//   position.setFromMatrixPosition( object.matrixWorld );
//   var quaternion = new THREE.Quaternion();
//   quaternion.setFromRotationMatrix( object.matrixWorld );
//   return local;
// }

export default root;
