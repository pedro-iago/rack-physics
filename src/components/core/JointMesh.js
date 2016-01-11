import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { JointGeometry } from './geometries';

const JointMesh = ( { type, vertices, name, visible } ) =>
  <line
    name = {name}
    visible = {visible}
  >
    <JointGeometry
      type = {type}
      vertices = {vertices}
    />
    <lineBasicMaterial
      color = {0xffff00}
    />
  </line>

JointMesh.propTypes = {
  type: _.any.isRequired,
  vertices: _.arrayOf(_c.vec3.isRequired).isRequired,
  name: _.string.isRequired,
  visible: _.bool
}

JointMesh.defaultProps = {
  visible: false
}

export default JointMesh;
