import React, { PropTypes as _ } from 'react';
import _c from '../utils/CustomPropTypes';
import { BODIES } from '../Macros';
import { BodyMesh } from './index';

const OimoBody = ( { type, dim, pos, rot, visible, move } ) =>
  <BodyMesh
    type = {type}
    dim = {dim}
    pos = {pos}
    rot = {rot}
    visible = {visible}
    wireframe = {!move}
  />

OimoBody.propTypes = {
  type: _.oneOf(BODIES).isRequired,
  dim: _c.dim.isRequired,
  pos: _c.vec3,
  rot: _c.vec3,
  density: _.number,
  friction: _.number,
  restituition: _.number,
  move: _.bool,
  visible: _.bool
}

OimoBody.defaultProps = {
  pos: {x: 0, y: 0, z: 0},
  rot: {x: 0, y: 0, z: 0},
  density: 1,
  friction: 0.4,
  restitution: 0.2,
  move: true,
  visible: true
}

export default OimoBody;
