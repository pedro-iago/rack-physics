import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { BodyGeometry } from './geometries';

const BodyMesh = ( { type, dim, name, dynamic, visible } ) =>
  <mesh
    name = {name}
    visible = {visible}
  >
    <BodyGeometry
      type = {type}
      dim = {dim}
      dynamic = {dynamic}
    />
    <meshNormalMaterial
      wireframe = {!dynamic}
    />
  </mesh>

BodyMesh.propTypes = {
  type: _.any.isRequired,
  dim: _.any.isRequired,
  name: _.string.isRequired,
  dynamic: _.bool,
  visible: _.bool
}

BodyMesh.defaultProps = {
  dynamic: true,
  visible: false
}

export default BodyMesh;
