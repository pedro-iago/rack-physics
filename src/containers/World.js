import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Namespace, Provide, View, Worker, Root } from '../hocs';
import { OimoBody, OimoJoint, OimoWorld } from '../components';
import { CannonCmd as PhysicsCmd } from '../workers';

export const World = compose(Provide, Root, Namespace, Worker(PhysicsCmd), View)(OimoWorld);
export const Body = compose(Namespace, View)(OimoBody);
export const Joint = compose(Namespace, View)(OimoJoint);

export default World;
