import React, { Component, PropTypes as _ } from 'react';
import React3 from 'react-three-renderer';
import ReactDOM from 'react-dom';
import THREE from 'three.js';
import {connect} from 'react-redux';
import {step} from '../actions/worker';
import {TrackballControls} from '../utils';

@connect()
class ThreeApp extends Component {
  state = {
    mainCameraPosition: new THREE.Vector3(0, 0, 10000),
  }
  componentDidMount() {
    const controls = new TrackballControls(this.refs.mainCamera, ReactDOM.findDOMNode(this.refs.react3));
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener('change', () => this.setState({
      mainCameraPosition: this.refs.mainCamera.position
    }));
    this.controls = controls;
  }
  _onAnimate = () => {
    this.props.dispatch( step() );
    this.controls.update();
  }
  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }
  render() {
    const {mainCameraPosition} = this.state;
    const {innerWidth, innerHeight} = window;
    return (
      <React3
        ref="react3"
        mainCamera="camera"
        width={innerWidth}
        height={innerHeight}
        onAnimate={this._onAnimate}
      >
        <scene>
          <perspectiveCamera
            ref="mainCamera"
            name="camera"
            fov={75}
            aspect={innerWidth / innerHeight}
            near={10}
            far={100000}
            position={mainCameraPosition}
          />
          {this.props.children}
        </scene>
      </React3>
    );
  }
}

export default ThreeApp;
