import React, { Component, PropTypes as _ } from 'react';
import React3 from 'react-three-renderer';
import ReactDOM from 'react-dom';
import THREE from 'three.js';
import {store} from '../hocs/Provide';
import {loop} from '../actions/worker';
import {TrackballControls} from '../utils';

class ThreeApp extends Component {
  state = {
    mainCameraPosition: new THREE.Vector3(0, 0, 1000),
    width: window.innerWidth,
    height: window.innerHeight
  }
  componentDidMount() {
    window.addEventListener('resize', () => this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    }));
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
    store.dispatch( loop() );
    this.controls.update();
  }
  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }
  render() {
    const {mainCameraPosition, width, height} = this.state;
    return (
      <React3
        ref="react3"
        mainCamera="camera"
        width={width}
        height={height}
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
