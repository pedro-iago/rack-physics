import React from 'react';
import { compose } from 'redux';
import { Namespace, Provide, View, Worker, Root, Transform } from '../hocs';
import { BodyMesh, JointMesh, WorldMesh } from '../components/core';
import { CannonCmd as PhysicsCmd } from '../workers';

export const World = compose(Provide, Root, Namespace, Worker(PhysicsCmd), View, Transform)(WorldMesh);
export const Body = compose(Namespace, View, Transform)(BodyMesh);
export const Joint = compose(Namespace, View)(JointMesh);

//this is the place where I should add the default props and propTypes to World, Body, and Joint

// //Proof of Concept
// import { Hcsr04Sim, Pic18fSim } from '../workers';
// import { Worker, Custom } from '../hocs';
// const Box = (props) => <Body {...props} type = TYPE.BOX/>;
// const Cylinder = (props) => <Body {...props} type = TYPE.CYLINDER/>;
// const Car = (props) =>
//   <Body
//     pos={props.pos}
//     name={props.name}
//     qua={props.qua}
//   >
//     {props.children}
//     <Box {...}/>; //dumbest car eva
//     <Cylinder {...}/>;
//     <Cylinder {...}/>;
//     <Cylinder {...}/>;
//     <Cylinder {...}/>;
//   </Body>;
// const Hcsr04 = Worker(Hcsr04Sim)(Box);
// const Pic18f = Worker(Pic18fSim)(Box);
// const SmartCar = ({name, pos, qua}) =>
//   <Car
//     pos={pos}
//     name={name}
//     qua={qua}
//   >
//     <Hcsr04
//       pos = {{x: 0, y: 0, z: 10}}
//       size = {{width: 10, height: 10, depth: 10}}
//     />
//     <Pic18f
//       pos = {{x: 0, y: 0, z: -30}}
//       size = {{width: 10, height: 10, depth: 10}}
//     />
//   </Car>

export default World;
