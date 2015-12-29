import { PropTypes as _ } from 'react';

const vec3 = _.shape({
  x: _.number,
  y: _.number,
  z: _.number,
});

const pose = _.shape({
  pos: vec3,
  rot: vec3
});

const worldSettings = _.shape({
  G: _.number,
  iterations: _.number,
  timestep: _.number,
  broadphase: _.oneOf([1, 2, 3])
});

const dim = _.shape({
  width: _.number,
  height: _.number,
  depth: _.number,
  radius: _.number,
  radiusTop: _.number,
  radiusBottom: _.number,
});

const CustomPropTypes = {
  vec3,
  pose,
  worldSettings,
  dim
};

//I prefer to import _c from './CustomPropTypes';
export default CustomPropTypes;
