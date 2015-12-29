import React from 'react';
import { compose } from 'redux';
import { Namespace, Provide, Subscribe, Worker } from '../hocs';
import { OimoBody, OimoJoint, OimoWorld } from '../components';
import { OimoCmd } from '../workers';

export const World = compose(Provide, Worker(OimoCmd), Namespace)(OimoWorld);
export const Body = compose(Subscribe, Namespace)(OimoBody);
export const Joint = compose(Subscribe, Namespace)(OimoJoint);
export default World;
