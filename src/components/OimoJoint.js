import React, { PropTypes as _ } from 'react';
import _c from '../utils/CustomPropTypes';
import { JOINTS } from '../Macros';
import { JointMesh } from './index';

const OimoJoint = ( { type, anchors, limits, visible } ) =>
  <JointMesh
    type = {type}
    anchors = {anchors}
    limits = {limits}
    visible = {visible}
  />

OimoJoint.propTypes = {
  type: _.oneOf(JOINTS).isRequired,
  bodies: _.arrayOf(_.string.isRequired).isRequired,
  anchors: _.arrayOf(_c.vec3.isRequired),
  axis: _.arrayOf(_c.vec3.isRequired),
  limits: _.arrayOf(_.number.isRequired),
  damping: _.number,
  stiffness: _.number,
  maxForce: _.number,
  maxTorque: _.number,
  visible: _.bool
}

OimoJoint.defaultProps = {
  anchors: [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ],
  axis: [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ],
  limits: [ 0, 1000 ],
  damping: 0.8,  
  stifness: 0.5,
  maxForce: 1e16,
  maxTorque: 1e12,
  visible: false
}

export default OimoJoint;
