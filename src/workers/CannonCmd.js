'use strict';
import CANNON from 'cannon';
import { Vec3, Quat, Pose } from '../utils/VectorUtils';
import { uniqueUnion, getParent } from '../hocs/Namespace';
import * as TYPE from '../Macros';
import merge from 'lodash.merge';

var lastTime = Date.now();
var world = new CANNON.World();
var bodies = {};
var joints = {};

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

//I think it's better to send stuff in the correct order maybe? world - body - joints
function SETUP(objects, id){
  let jointslist = [];
  let bodieslist = [];
  let subscribed = {};
  for(const key in objects){
    let object  = {...objects[key], name: key};
    if( key === id ){
      if( init(object) ) subscribed[key] = {...objects[key], visible: true};
    }
    else if( TYPE.BODIES.includes(object.type) )
      bodieslist.push(object);
    else if( TYPE.JOINTS.includes(object.type) )
      jointslist.push(object);
  }
  for(const b of bodieslist)
    if( addBody(b) ) subscribed[b.name] = {...objects[b.name], visible: true};
  for(const j of jointslist)
    if( addJoint(j) ) subscribed[j.name] = {...objects[j.name], visible: true};
  return subscribed;
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var LOOP = function(objects, id){
  world.step(world.dt, lastTime);
  lastTime = Date.now();
  let payload = {};
  for (const key in bodies) {
    const body = bodies[key];
    if(body.sleepState !== CANNON.Body.SLEEPING){
      const pos = Vec3.scale(body.position, 1);
      const qua = Quat.scale(body.quaternion, 1);
      payload = { ...payload, [key]: {pos, qua} };
    }
  }
  for (const key in joints) {
    const joint = joints[key];
    const ap1 = Vec3.scale(joint.bodyA.position, 1);
    const ap2 = Vec3.scale(joint.bodyB.position, 1);
    payload = { ...payload, [key]: {anchors: [ap1, ap2]} };
  }
  return payload;
}

//--------------------------------------------------
//   CLEAR WORLD AND ALL OBJECT
//--------------------------------------------------

var clear = function(){
  world.clearForces();
  joints.forEach( j => world.removeConstraint(j) );
  bodies.forEach( b => world.removeBody(b) );
  bodies = {};
  joints = {};
}

//--------------------------------------------------
//   INIT WORLD WITH SETTINGS
//--------------------------------------------------

function init( {G, iterations, timestep, broadphase} ){
  world.gravity = new CANNON.Vec3(0, G, 0);
  world.solver.iterations = iterations;
  world.dt = timestep;
  switch(broadphase){
    case TYPE.BRUTE: world.broadPhase = new CANNON.NaiveBroadphase(); break;
    case TYPE.SWEEP: default: world.broadPhase = new CANNON.SAPBroadphase(); break;
    case TYPE.TREE: world.broadPhase = new CANNON.GridBroadphase(); break;
  }
  return true;
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

var addBody = function( {name, type, pos, qua, dim, density, friction, restituition, dynamic} ){
  const position = new CANNON.Vec3(pos.x, pos.y, pos.z);
  const quaternion = new CANNON.Quaternion(qua.x, qua.y, qua.z, qua.w);
  const {width, height, depth, radius} = dim;
  let shape;
  switch(type){
    case TYPE.BOX: shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)); break;
    case TYPE.SPHERE: shape = new CANNON.Sphere(radius); break;
    case TYPE.CYLINDER: shape = new CANNON.Cylinder(radius, radius, height, 12); break;
  }
  const mass = dynamic? shape.volume()*density : 0;
  const material = new CANNON.Material( {friction, restituition} );
  const ctype = dynamic? CANNON.Body.DYNAMIC : CANNON.Body.STATIC;
  var b = new CANNON.Body({position, quaternion, shape, mass, material, type: ctype});
  world.addBody(b);
  bodies[name] = b;
  return true;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------
//TODO other types
var addJoint = function({name, type, bodies: bodiesNames, anchors, limits, axis, damping, stiffness, maxForce, maxTorque}){
  const bodyA = bodies[uniqueUnion(bodiesNames[0], getParent(name))];
  const bodyB = bodies[uniqueUnion(bodiesNames[1], getParent(name))];
  const pivotA = new CANNON.Vec3(anchors[0].x, anchors[0].y, anchors[0].z);
  const pivotB = new CANNON.Vec3(anchors[1].x, anchors[1].y, anchors[1].z);
  const axisA = new CANNON.Vec3(axis[0].x, axis[0].y, axis[0].z);
  const axisB = new CANNON.Vec3(axis[1].x, axis[1].y, axis[1].z);
  let j;
  switch(type){
    case TYPE.JOINT_BALL_AND_SOCKET: j = new CANNON.PointToPointConstraint(bodyA, pivotA, bodyB, pivotB, maxForce); break;
    case TYPE.JOINT_HINGE: j = new CANNON.HingeConstraint(bodyA, bodyB, {pivotA, pivotB, axisA, axisB, maxForce}); break;
    case TYPE.JOINT_DISTANCE: j = new CANNON.DistanceConstraint(bodyA, bodyB, limits[0], maxForce); break;
  }
  world.addConstraint(j);
  if( type === TYPE.JOINT_DISTANCE )
    joints[name] = j;
  return true;
}
