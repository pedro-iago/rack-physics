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
      dynamic
    />;
  default:
    return <sphereGeometry/>;
}};

JointGeometry.propTypes = {
  type: _.oneOf([JOINT_DISTANCE]),
  vertices: (...args) => {
    const s = _.arrayOf(_c.vec3);
    return args[0].type? s.isRequired(...args) : s(...args);
  }
}

export default JointGeometry;
