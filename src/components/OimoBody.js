import React, { PropTypes as _ } from 'react';
import _c from '../utils/CustomPropTypes';
import { BODIES } from '../Macros';
import { BodyMesh } from './index';

const OimoBody = ( { type, dim, pos, qua, visible, move } ) =>
  <BodyMesh
    type = {type}
    dim = {dim}
    pos = {pos}
    qua = {qua}
    visible = {visible}
    wireframe = {!move}
  />

OimoBody.propTypes = {
  type: _.oneOf(BODIES).isRequired,
  dim: _c.dim.isRequired,
  pos: _c.vec3,
  qua: _c.vec4,
  density: _.number,
  friction: _.number,
  restituition: _.number,
  move: _.bool,
  visible: _.bool
}

OimoBody.defaultProps = {
  pos: {x: 0, y: 0, z: 0},
  qua: {x: 1, y: 0, z: 0, w: 0},
  density: 1,
  friction: 0.4,
  restitution: 0.2,
  move: true,
  visible: false
}

export default OimoBody;
