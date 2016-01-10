import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { JointGeometry } from './geometries';

//TODO: conditional mesh denpending on the type (line, points, mesh)
const JointMesh = ( { type, anchors, limits, visible } ) =>
  <line
    visible = {visible}
  >
    <JointGeometry
      type = {type}
      anchors = {anchors}
    />
    <lineBasicMaterial
      color = {0xffff00}
    />
  </line>

JointMesh.propTypes = {
  type: _.any.isRequired,
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

JointMesh.defaultProps = {
  anchors: [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ],
  axis: [ {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0} ],
  limits: [ 0, 1000 ],
  damping: 0.8,
  stifness: 0.5,
  maxForce: 1e16,
  maxTorque: 1e12,
  visible: false
}

export default JointMesh;
