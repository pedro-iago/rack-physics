import React, { PropTypes as _ } from 'react';
import _c from '../utils/CustomPropTypes';
import THREE from 'three.js';
import { JOINT_DISTANCE } from '../Macros';

const JointMesh = ( {visible, type, anchors, limits} ) => {
  const meshes = {
    [JOINT_DISTANCE]:
      <line
      >
        <geometry
          vertices = {[
            new THREE.Vector3(anchors[0].x, anchors[0].y, anchors[0].z),
            new THREE.Vector3(anchors[1].x, anchors[1].y, anchors[1].z)
          ]}
        />
        <lineBasicMaterial
          visible = {visible}
          color = {0xffff00}
        />
     </line>
  };
  return meshes[type] || <group/>;
}

JointMesh.propTypes = {
  visible: _.bool.isRequired,
  type: _.oneOf([JOINT_DISTANCE]).isRequired,
  anchors: _.arrayOf(_c.vec3.isRequired).isRequired,
  limits: _.arrayOf(_.number.isRequired).isRequired
}

export default JointMesh;
