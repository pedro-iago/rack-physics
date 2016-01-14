import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { JointGeometry } from './geometries';

const JointMesh = ( { type, anchors, name, visible } ) =>
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
  type: _.any.isRequired,
  anchors: _.arrayOf(_c.vec3).isRequired,
  name: _.string.isRequired,
  visible: _.bool
}

JointMesh.defaultProps = {
  visible: false
}

export default JointMesh;
