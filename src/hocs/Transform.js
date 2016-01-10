import React, {Component, PropTypes as _} from 'react';
import THREE from 'three.js';
import _c from '../utils/CustomPropTypes';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const Transform = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  const Wrapper = ( { pos, qua, children, ...rest } ) =>
    <object3D
      position = { new THREE.Vector3(pos.x, pos.y, pos.z) }
      quaternion = { new THREE.Quaternion(qua.x, qua.y, qua.z, qua.w) }
    >
      { children || Wrapped(rest) }
    </object3D>;

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Transform');
  Wrapper.propTypes = {
    pos: _c.vec3,
    qua: _c.vec4
  };
  Wrapper.defaultProps = {
    ...BaseComponent.defaultProps,
    pos: {x: 0, y: 0, z: 0},
    qua: {x: 0, y: 0, z: 0, w: 1}
  };

  return Wrapper;
}

export default Transform;
