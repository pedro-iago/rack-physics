import {take, put, call, fork, join} from 'redux-saga';
import {SPAWN, SETUP, LOOP, TERMINATE} from '../Macros';
import {spawn, setup, loop, terminate} from '../actions/worker';
import {message, broadcast} from '../api';
import {Vec3, Quat} from '../utils/VectorUtils';
import THREE from 'three.js';
import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';

let three = {};
function* root( getState ){
  let pipeline = {};
  while(true){
    const tasks = yield take();
    for(const task of tasks){
      const next = yield call(fetch, task, getState);
      if(pipeline.meta && !!pipeline.meta.length)
        yield put(pipeline);
      pipeline = yield join(next || ( yield fork({}) ));
      if(task.type === LOOP) //ugly loop asymetry
        pipeline.payload = toLocal(pipeline.payload)
    }
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  if(type === SETUP)
    three = {...three, ...payload};
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

//I think a better way of resolving this is serializing the three.js objects and sending them instead!
//actually, serializing only what is important, like position and bla bla bla
//and them workers can choose to reconstruct three objects on their side, or use the json directly
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

function toLocal( world ){
  return mapValues(world, (json, key) => {
    if(!json.pos) {
      json.pos = {x: 0, y: 0, z: 0};
      json.qua = {x: 0, y: 0, z: 0, w: 1};
    }//ugly joint asymetry
    const object = three[key];
    let position = new THREE.Vector3(json.pos.x, json.pos.y, json.pos.z);
    let quaternion = new THREE.Quaternion(json.qua.x, json.qua.y, json.qua.z, json.qua.w);
    object.traverseAncestors( (pops) => {//ugly O(n2) solution
      if(pops !== object){
        position = pops.position.clone().negate().add(position);
        quaternion = pops.quaternion.conjugate().clone().multiply(quaternion);
      }
    });
    const pos = Vec3.scale(position, 1);
    const qua = Quat.scale(quaternion, 1);
    return {...json, pos, qua};
  });
}

export default root;
