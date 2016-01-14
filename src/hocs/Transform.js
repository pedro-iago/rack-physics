import React, {Component, PropTypes as _} from 'react';
import _c from '../utils/CustomPropTypes';
import {store} from './Provide';
import {setup} from '../actions/worker';
import THREE from 'three.js';

const Transform = Wrapped => {
  class Wrapper extends Component {
    static contextTypes = {
      id: _.string.isRequired,
      state: _.any.isRequired
    };
    static propTypes = {
      pos: _c.vec3,
      qua: _c.vec4,
      children: _.any
    };
    static defaultProps = {
      pos: {x: 0, y: 0, z: 0},
      qua: {x: 0, y: 0, z: 0, w: 1}
    };
    render() {
      const {id, state} = this.context;
      const {pos, qua, children, ...userData} = state[id] || this.props;
      return (
        <object3D
          position = { new THREE.Vector3(pos.x, pos.y, pos.z) }
          quaternion = { new THREE.Quaternion(qua.x, qua.y, qua.z, qua.w) }
          ref = { (inst) => {if(inst) inst.userData.rack = userData} }
          name = { id }
        >
          { /*if inst on the ref here allows for the user data to only be unsync with any changes of it after mounting! The problem is react-three-renderer ref is null after mounting!*/}
          { children || <Wrapped {...this.props} {...state[id]}/> }
          { /*why children can't be side by side with Wrapped? That could be useful for controllers, so that their id is the Body namespace*/ }
        </object3D> );
    };
  }
  return Wrapper;
}

export default Transform;
