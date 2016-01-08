import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Namespace, Provide, Subscribe, Worker, Root } from '../hocs';
import { OimoBody, OimoJoint, OimoWorld } from '../components';
import { OimoCmd } from '../workers';

export const World = compose(Provide, Root, Namespace, Worker(OimoCmd), Subscribe)(OimoWorld);
export const Body = compose(Namespace, Subscribe)(OimoBody);
export const Joint = compose(Namespace, Subscribe)(OimoJoint);

export default World;
