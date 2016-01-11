import React, { PropTypes as _ } from 'react';
import { compose } from 'redux';
import { Provide, Root, Namespace, Worker, Transform } from '../hocs';
import { WorldMesh } from '../components/core';
import { CannonCmd as PhysicsSim } from '../workers';
import { BRUTE, SWEEP, TREE } from '../Macros';

const World = compose(Provide, Root, Namespace, Worker(PhysicsSim), Transform)(WorldMesh);

World.propTypes = {
  G: _.number,
  iterations: _.number,
  timestep: _.number,
  broadphase: _.oneOf([BRUTE, SWEEP, TREE])
};

World.defaultProps = {
  G: 10,
  iterations: 8,
  timestep: 1/60,
  broadphase: SWEEP
}

export default World;
