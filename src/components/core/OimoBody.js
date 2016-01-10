import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import THREE from 'three.js';
import { BODIES } from '~/Macros';
import { BodyGeometry } from './geometries';

//TODO: consider taking Material as a prop (defaults to "meshNormalMaterial")
const OimoBody = ( { type, dim, pos, qua, move, visible, children } ) =>
  <object3D
    position = { new THREE.Vector3(pos.x, pos.y, pos.z) }
    quaternion = { new THREE.Quaternion(qua.x, qua.y, qua.z, qua.w) }
  >
    { children ||
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
    </mesh> }
  </object3D>

OimoBody.propTypes = {
  type: _.any,
  dim: _.any,
  pos: _c.vec3,
  qua: _c.vec4,
  density: _.number,
  friction: _.number,
  restituition: _.number,
  move: _.bool,
  visible: _.bool,
  // Material: _.oneOf([_.func, _.string])
}

OimoBody.defaultProps = {
  pos: {x: 0, y: 0, z: 0},
  qua: {x: 0, y: 0, z: 0, w: 0},
  density: 1,
  friction: 0.4,
  restitution: 0.2,
  move: true,
  visible: false,
  // Material: "meshNormalMaterial"
}

export default OimoBody;
