import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import THREE from 'three.js';
import { JOINT_DISTANCE } from '~/Macros';

const JointGeometry = ( {type, anchors} ) => {
  const geometries = {
    [JOINT_DISTANCE]:
      <geometry
        vertices = {[
          new THREE.Vector3(anchors[0].x, anchors[0].y, anchors[0].z),
          new THREE.Vector3(anchors[1].x, anchors[1].y, anchors[1].z)
        ]}
      />
  };
  return geometries[type];
}

JointGeometry.propTypes = {
  type: _.oneOf([JOINT_DISTANCE]).isRequired,
  anchors: _.arrayOf(_c.vec3.isRequired).isRequired
}

export default JointGeometry;
