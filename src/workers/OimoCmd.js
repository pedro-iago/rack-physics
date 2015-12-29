//---------------------------------------------------
//   OimoPhysics use international system units
//   0.1 to 10 meters max for dynamique body
//   size and position x100 for three.js
//---------------------------------------------------
//TODO substitute .indexOf() >= 0 by .include() as soon as babel 6 is stable

/* global self */
'use strict';
import pick from 'lodash.pick';
import OIMO from '../utils/Oimo';
import { Vec3 } from '../utils/VectorUtils';
import { uniqueUnion } from '../hocs/Namespace';
import * as TYPE from '../Macros';

// physics world
var myKey = undefined;
var world = new OIMO.World();
var bodies = [];
var joints = [];

//--------------------------------------------------
//   WORKER MESSAGE
//--------------------------------------------------

self.onmessage = function (e) {
  const { type, meta, payload = {} } = e.data;
  let input = pick( payload, (_, key) => key.startsWith(myKey) );
  let result = {};
  switch(type){
    case TYPE.SPAWN:
      myKey = meta;
    break;
    case TYPE.INIT:
      result = INIT(input);
    break;
    case TYPE.SUBSCRIBE:
      result = SUBSCRIBE(input);
    break;
    case TYPE.STEP:
      result = STEP(input);
    break;
  }
  self.postMessage({type, meta: myKey, payload: result});
}

//--------------------------------------------------
//   INIT WORLD WITH SETTINGS
//--------------------------------------------------

function INIT(settings){
  clear();
  const {G, iterations, timestep, broadphase} = settings[myKey];
  world.gravity = new OIMO.Vec3(0, G, 0);
  world.numIterations = iterations;
  world.timeStep = timestep;
  switch(broadphase){
    case TYPE.BRUTE: world.broadPhase = new OIMO.BruteForceBroadPhase(); break;
    case TYPE.SWEEP: default: world.broadPhase = new OIMO.SAPBroadPhase(); break;
    case TYPE.TREE: world.broadPhase = new OIMO.DBVTBroadPhase(); break;
  }
}

//--------------------------------------------------
//   ADD SOMETING ON FLY
//--------------------------------------------------

//TODO refuse to overwrite objects with the same key and then call something like
//self.postMessage({type: TYPE.SUBSCRIBE, payload: "Objects have the same name!", error: true});
function SUBSCRIBE(objects){
  for(const key in objects){
    let object  = {...objects[key], name: key};
    if( TYPE.JOINTS.indexOf(object.type) >= 0 ) addJoint(object);
    else if ( TYPE.BODIES.indexOf(object.type) >= 0 ) addBody(object);
  }
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var STEP = function(objects){
  //TODO: figure out a way of using these objects instead (they could pottentially have changes over my step version)
  world.step();
  let payload = {};
  for (const body of bodies) {
    if(!body.sleeping){
      const pos = Vec3.scale(body.position, OIMO.WORLD_SCALE);
      const rot = Vec3.scale(body.getRotation(), 180/OIMO.PI);
      payload = { ...payload, [body.name]: {pos, rot} };
    }
  }
  for (const joint of joints) {
    const ap1 = Vec3.scale(joint.localAnchorPoint1, OIMO.WORLD_SCALE);
    const ap2 = Vec3.scale(joint.localAnchorPoint2, OIMO.WORLD_SCALE);
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
//    BASIC OBJECT
//--------------------------------------------------

var addBody = function( {name, type, pos, rot, dim, density, friction, restituition, move} ){
  pos = [pos.x, pos.y, pos.z];
  rot = [rot.x, rot.y, rot.z];
  const {width, height, depth, radius} = dim;
  let size = [];
  switch(type){
    case TYPE.BOX: size = [width, height, depth]; break;
    case TYPE.SPHERE: size = [radius]; break;
    case TYPE.CYLINDER: size = [height, radius]; break;
  }
  var b = world.add( {name, type, pos, rot, size, density, friction, restituition, move} );
  bodies.push(b);
  return b.type;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

//THIS IS UGLY COUSE OIMO IS UGLY
var addJoint = function({name, type, bodies, anchors, limits, axis, damping, stiffness, maxForce, maxTorque}){
  const body1 = uniqueUnion(bodies[0], myKey);
  const body2 = uniqueUnion(bodies[1], myKey);
  const axe1 = [axis[0].x, axis[0].y, axis[0].z];
  const axe2 = [axis[1].x, axis[1].y, axis[1].z];
  const pos1 = [anchors[0].x, anchors[0].y, anchors[0].z];
  const pos2 = [anchors[1].x, anchors[1].y, anchors[1].z];
  const min = limits[0];
  const max = limits[1];
  const limit = limits;
  const spring = [1/stiffness, damping];
  var j = world.add({name, type, body1, body2, axe1, axe2, pos1, pos2, spring, allowCollision: true});
  if( type === TYPE.JOINT_DISTANCE )
    joints.push(j);
  return j.type;
}
