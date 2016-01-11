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
    componentDidMount() {
      const {id} = this.context;
      const {pos, qua, children, ...rest} = this.props;
      const inst = this.refs["obj3d"];
      inst.userData.rack = rest;
      store.dispatch( setup({ [id]: inst }) );
    };
    render() {
      const {id, state} = this.context;
      const {pos, qua} = state[id] || this.props;
      return (
        <object3D
          position = { new THREE.Vector3(pos.x, pos.y, pos.z) }
          quaternion = { new THREE.Quaternion(qua.x, qua.y, qua.z, qua.w) }
          ref = "obj3d"
        >
          { this.props.children || <Wrapped {...this.props} {...state[id]}/> }
        </object3D> );
    };
  }
  return Wrapper;
}

export default Transform;
