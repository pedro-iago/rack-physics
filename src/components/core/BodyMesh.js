import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { BodyGeometry } from './geometries';

const BodyMesh = ( { name, type, dim, dynamic, visible } ) =>
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
  name: _.string.isRequired,
  type: _.any,
  dim: _.any,
  dynamic: _.bool,
  visible: _.bool
}

BodyMesh.defaultProps = {
  dynamic: true,
  visible: false
}

export default BodyMesh;
