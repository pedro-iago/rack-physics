import React, { Component, PropTypes as _ } from 'react';
import React3 from 'react-three-renderer';
import ReactDOM from 'react-dom';
import THREE from 'three.js';
import {store} from '../hocs/Provide';
import {step} from '../actions/worker';
import {TrackballControls} from '../utils';

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
  //animation frame is blocking sagas since is being called too many times
  //however, when I open chrome timeline, the cpu wants to show off and runs at 100%
  //and what happens is that, usually, for each frame I get one run in the sagas (ideal case)
  //how to force the cpu to always run at 100%? is that even the true reason it's faster?
  //why request animation frame it's 5x times slower when I got the devtools on? quite unexpected...
  //what if I could delay the browser refresh rate to 30 fps? that would give more time to sagas and still it would be smooth to my eyes
  _onAnimate = () => {
    console.log("render");
    store.dispatch( step() );
    this.controls.update();
    //console.log("request");
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
