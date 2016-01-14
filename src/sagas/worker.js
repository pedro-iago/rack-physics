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
      //ugly loop asymetry will be solved when worker reconstruct @root
      if(task.type === LOOP)
        pipeline.payload = toLocal(pipeline.payload)
    }
  }
}

function* fetch( {type, payload}, getState ){
  const {WorkReducer: workers, ViewReducer: objects} = getState();
  //ugly saga with state can be solved when toLocal is not here anymore! which is when workers can reconstruct @root from LOOP payload
  if(type === SETUP)
    three = {...three, ...payload};
  switch(type){
    case SPAWN: return yield call(fetchSpawn, payload);
    case SETUP: return yield fork(broadcast, workers, setup(toGlobal(payload)));
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
//TODO: think more about serializing it and the possibility of using the raycast and all of its functions in the workers
//the needs for refs can go out if I don't use this... but I actually prefer this for setup than sending each separetely
//maybe I can call toJSON before sending the ref? and then setup will just pass its payloads with the @root and let the worker reconstruct it and deal with it
function toGlobal( { "@root": view } ){
  let objects = {};
  view.traverse( object => {
    if(object.name !== "@root" && object.name.startsWith("@root")){ //PARANOIA!! GOT OUT! why it seems that when I don't send "@root,Paradim I get a performance boost???"
      const {name, ...physics} = object.userData.rack;
      const mesh = object.getObjectByName(name);
      if(mesh){
        var dynamic = mesh.geometry.dynamic;
        var visible = mesh.visible;
      }
      var position = new THREE.Vector3();
      position.setFromMatrixPosition( object.matrixWorld );
      var quaternion = new THREE.Quaternion();
      quaternion.setFromRotationMatrix( object.matrixWorld );
      const pos = Vec3.scale(position, 1);
      const qua = Quat.scale(quaternion, 1);
      objects[object.name] = { ...physics, visible, dynamic, pos, qua };
    }
  });
  return objects;
}

//function will be better handled on worker side, for that I need the three.js @root there.
function toLocal( world ){
  return mapValues(world, (json, key) => {
    if(!json.pos) {
      json.pos = {x: 0, y: 0, z: 0};
      json.qua = {x: 0, y: 0, z: 0, w: 1};
    }//ugly joint asymetry
    const object = three["@root"].getObjectByName(key);
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
