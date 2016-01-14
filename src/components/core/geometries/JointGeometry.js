import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import THREE from 'three.js';
import { JOINT_DISTANCE } from '~/Macros';

const JointGeometry = ( {type, vertices} ) => {switch(type){
  case JOINT_DISTANCE:
    return <geometry
      vertices = {[
        new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z),
        new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z)
      ]}
    />
  default:
    return;
}};

JointGeometry.propTypes = {
  type: _.oneOf([JOINT_DISTANCE]).isRequired,
  vertices: _.arrayOf(_c.vec3).isRequired
}

export default JointGeometry;
