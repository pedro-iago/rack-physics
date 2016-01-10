import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Namespace, Provide, View, Worker, Root } from '../hocs';
import { OimoBody, OimoJoint, OimoWorld } from '../components/core';
import { OimoCmd as PhysicsCmd } from '../workers';

export const World = compose(Provide, Root, Namespace, Worker(PhysicsCmd), View)(OimoWorld);
export const Body = compose(Namespace, View)(OimoBody);
export const Joint = compose(Namespace, View)(OimoJoint);

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
