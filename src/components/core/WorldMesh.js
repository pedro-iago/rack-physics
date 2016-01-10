import React, { PropTypes as _ } from 'react';
import { BRUTE, SWEEP, TREE } from '~/Macros';

const WorldMesh = ({children}) =>
  <object3D>{children}</object3D>;

WorldMesh.propTypes = {
  children: _.any,
  G: _.number,
  iterations: _.number,
  timestep: _.number,
  broadphase: _.oneOf([BRUTE, SWEEP, TREE])
};

WorldMesh.defaultProps = {
  G: 10,
  iterations: 8,
  timestep: 1/60,
  broadphase: SWEEP
}

export default WorldMesh;
