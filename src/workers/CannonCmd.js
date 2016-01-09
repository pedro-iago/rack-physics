'use strict';
import CANNON from 'cannon';
import { Vec3 } from '../utils/VectorUtils';
import { uniqueUnion, getParent } from '../hocs/Namespace';
import * as TYPE from '../Macros';

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

function SETUP(objects, id){
  let subscribed = {};
  for(const key in objects){
    let object  = {...objects[key], name: key};
    if( key === id && init(object) ||
        TYPE.JOINTS.indexOf(object.type) >= 0 && addJoint(object) ||
        TYPE.BODIES.indexOf(object.type) >= 0 && addBody(object)  )
      subscribed[key] = {...objects[key], visible: true};
  }
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
      let rot = new CANNON.Vec3(0,0,0);
      body.quaternion.toEuler(rot);
      rot = Vec3.scale(rot, 180/3.14);
      payload = { ...payload, [key]: {pos, rot} };
    }
  }
  for (const key in joints) {
    const joint = joints[key];
    const ap1 = Vec3.scale(joint.pivotA, 1);
    const ap2 = Vec3.scale(joint.pivotB, 1);
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

var addBody = function( {name, type, pos, rot, dim, density, friction, restituition, move} ){
  const position = new CANNON.Vec3(pos.x, pos.y, pos.z);
  const quaternion = new CANNON.Quaternion(0, 0, 0, 0);
  quaternion.setFromEuler(rot.x, rot.y, rot.z);
  const {width, height, depth, radius} = dim;
  let shape;
  switch(type){
    case TYPE.BOX: shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)); break;
    case TYPE.SPHERE: shape = new CANNON.Sphere(radius); break;
    case TYPE.CYLINDER: shape = new CANNON.Cylinder(radius, radius, height, 12); break;
  }
  const mass = move? shape.volume()*density : 0;
  const material = new CANNON.Material( {friction, restituition} );
  const ctype = move? CANNON.Body.DYNAMIC : CANNON.Body.STATIC;
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
    case TYPE.JOINT_DISTANCE: j = new CANNON.PointToPointConstraint(bodyA, pivotA, bodyB, pivotB, maxForce); break;
    case TYPE.JOINT_HINGE: j = new CANNON.HingeConstraint(bodyA, bodyB, {pivotA, pivotB, axisA, axisB, maxForce}); break;
  }
  world.addConstraint(j);
  if( type === TYPE.JOINT_DISTANCE )
    joints[name] = j;
  return true;
}
