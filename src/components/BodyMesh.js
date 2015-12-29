import React, { PropTypes as _ } from 'react';
import _c from '../utils/CustomPropTypes';
import THREE from 'three.js';
import { BOX, SPHERE, CYLINDER } from '../Macros';

const BodyMesh = ( {pos, rot, type, dim, visible, wireframe} ) => {
  const {width, height, depth, radius, radiusTop = radius, radiusBottom = radius} = dim;
  const geometries = {
    [BOX]:
      <boxGeometry
        width = {width}
        height = {height}
        depth = {depth}
      />,
    [SPHERE]:
      <sphereGeometry
        radius = {radius}
      />,
    [CYLINDER]:
      <cylinderGeometry
        height = {height}
        radiusTop = {radiusTop}
        radiusBottom = {radiusBottom}
      />
  };
  return(
    <mesh
      position = { new THREE.Vector3(pos.x, pos.y, pos.z) }
      rotation = { new THREE.Euler(rot.x, rot.y, rot.z) }
    >
      { geometries[type] }
      <meshBasicMaterial
        visible = {visible}
        wireframe = {wireframe}
        color = {0x00ff00}
      />
    </mesh>
  );
}

BodyMesh.propTypes = {
  pos: _c.vec3.isRequired,
  rot: _c.vec3.isRequired,
  type: _.oneOf([BOX, SPHERE, CYLINDER]).isRequired,
  dim: _c.dim.isRequired,
  visible: _.bool
}

export default BodyMesh;
