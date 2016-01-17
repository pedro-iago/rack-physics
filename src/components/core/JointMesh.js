import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { JointGeometry } from './geometries';

const JointMesh = ( { name, type, anchors, visible } ) =>
  <line
    name = {name}
    visible = {visible}
  >
    <JointGeometry
      type = {type}
      vertices = {anchors}
    />
    <lineBasicMaterial
      color = {0xffff00}
    />
  </line>

JointMesh.propTypes = {
  name: _.string.isRequired,
  type: _.any,
  anchors: _.arrayOf(_c.vec3),
  visible: _.bool
}

JointMesh.defaultProps = {
  visible: false
}

export default JointMesh;
