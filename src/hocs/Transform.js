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
    shouldComponentUpdate(np, ns, nextContext){
      const {id, state} = this.context;
      const {state: nextState} = nextContext;
      const {children} = this.props;
      return !!children? true : state[id] !== nextState[id];
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
          { /*inst may be null on ref: The problem is react-three-renderer ref is null after mounting!*/}
          { children }
          <Wrapped {...this.props} {...state[id]}/>
        </object3D> );
    };
  }
  return Wrapper;
}

export default Transform;
