//---------------------------------------------------
//   OimoPhysics use international system units
//   0.1 to 10 meters max for dynamique body
//   size and position x100 for three.js
//---------------------------------------------------

'use strict';
import OIMO from '../utils/Oimo';
import { Vec3, Quat } from '../utils/VectorUtils';
import { uniqueUnion, getParent } from '../hocs/Namespace';
import * as TYPE from '../Macros';

var world = new OIMO.World();
var bodies = [];
var joints = [];

//--------------------------------------------------
//   WORKER MESSAGE
//--------------------------------------------------

self.onmessage = ({data: action}) =>
  self.postMessage({ type: action.type, meta: action.meta, payload: run(action) });

function run({type, meta, payload}){
  switch(type){
    case TYPE.SETUP: return SETUP(payload, meta);
    case TYPE.LOOP: return LOOP(payload, meta);
  }
}

//--------------------------------------------------
//   ADD SOMETING ON FLY
//--------------------------------------------------

function SETUP(objects, id){
  let waitlist = [];
  let subscribed = {};
  for(const key in objects){
    let object  = {...objects[key], name: key};
    if( key === id && init(object) ||
        TYPE.BODIES.includes(object.type) && addBody(object)  )
      subscribed[key] = {...objects[key], visible: true};
    else if( TYPE.JOINTS.includes(object.type) )
      waitlist.push(object);
  }
  for(const j of waitlist){
    if( addJoint(j) )
      subscribed[j.name] = {...objects[j.name], visible: true};
  }
  return subscribed;
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var LOOP = function(objects, id){
  world.step();
  let payload = {};
  for (const body of bodies) {
    if(!body.sleeping){
      const pos = Vec3.scale(body.position, OIMO.WORLD_SCALE);
      const qua = Quat.scale(body.getQuaternion(), 1);
      payload = { ...payload, [body.name]: {pos, qua} };
    }
  }
  for (const joint of joints) {
    const ap1 = Vec3.scale(joint.anchorPoint1, OIMO.WORLD_SCALE);
    const ap2 = Vec3.scale(joint.anchorPoint2, OIMO.WORLD_SCALE);
    payload = { ...payload, [joint.name]: {anchors: [ap1, ap2]} };
  }
  return payload;
}

//--------------------------------------------------
//   CLEAR WORLD AND ALL OBJECT
//--------------------------------------------------

var clear = function(){
  world.clear();
  bodies = [];
  joints = [];
}

//--------------------------------------------------
//   INIT WORLD WITH SETTINGS
//--------------------------------------------------

function init( {G, iterations, timestep, broadphase} ){
  world.gravity = new OIMO.Vec3(0, G, 0);
  world.numIterations = iterations;
  world.timeStep = timestep;
  switch(broadphase){
    case TYPE.BRUTE: world.broadPhase = new OIMO.BruteForceBroadPhase(); break;
    case TYPE.SWEEP: default: world.broadPhase = new OIMO.SAPBroadPhase(); break;
    case TYPE.TREE: world.broadPhase = new OIMO.DBVTBroadPhase(); break;
  }
  return true;
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

var addBody = function( {name, type, pos, qua, dim, density, friction, restituition, dynamic} ){
  const position = [pos.x, pos.y, pos.z];
  const rot = Vec3.scale(Quat.toEuler(qua), 180/OIMO.PI);
  const rotation = [rot.x, rot.y, rot.z];
  const {width, height, depth, radius} = dim;
  let size = [];
  switch(type){
    case TYPE.BOX: size = [width, height, depth]; break;
    case TYPE.SPHERE: size = [radius]; break;
    case TYPE.CYLINDER: size = [height, radius]; break;
  }
  var b = world.add( {name, type, pos: position, rot: rotation, size, density, friction, restituition, move: dynamic} );
  bodies.push(b);
  return b.type !== OIMO.BODY_NULL;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

//THIS IS UGLY COUSE OIMO IS UGLY
var addJoint = function({name, type, bodies, anchors, limits, axis, damping, stiffness, maxForce, maxTorque}){
  const body1 = uniqueUnion(bodies[0], getParent(name));
  const body2 = uniqueUnion(bodies[1], getParent(name));
  const axe1 = [axis[0].x, axis[0].y, axis[0].z];
  const axe2 = [axis[1].x, axis[1].y, axis[1].z];
  const pos1 = [anchors[0].x, anchors[0].y, anchors[0].z];
  const pos2 = [anchors[1].x, anchors[1].y, anchors[1].z];
  const min = limits[0];
  const max = limits[1];
  const limit = limits;
  const spring = [1/stiffness, damping];
  var j = world.add({name, type, body1, body2, axe1, axe2, pos1, pos2, spring, min, max, allowCollision: true});
  if( type === TYPE.JOINT_DISTANCE )
    joints.push(j);
  return j.type !== OIMO.JOINT_NULL;
}
