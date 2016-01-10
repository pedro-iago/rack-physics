import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { BodyGeometry } from './geometries';

//TODO: consider taking Material as a prop (defaults to "meshNormalMaterial")
const BodyMesh = ( { type, dim, move, visible, children } ) =>
  <mesh
    visible = {visible}
  >
    <BodyGeometry
      type = {type}
      dim = {dim}
    />
    <meshNormalMaterial
      wireframe = {!move}
      color = {0x00ff00}
    />
  </mesh>

BodyMesh.propTypes = {
  type: _.any.isRequired,
  dim: _.any.isRequired,
  density: _.number,
  friction: _.number,
  restituition: _.number,
  move: _.bool,
  visible: _.bool,
  // Material: _.oneOf([_.func, _.string])
}

BodyMesh.defaultProps = {
  density: 1,
  friction: 0.4,
  restitution: 0.2,
  move: true,
  visible: false,
  // Material: "meshNormalMaterial"
}

export default BodyMesh;
