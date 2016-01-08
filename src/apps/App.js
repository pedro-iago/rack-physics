import React, { Component } from 'react';
import { Provide } from '../hocs';
import World, { Body, Joint } from '../containers/World';
import * as TYPE from '../Macros';
import { ThreeApp, DevTools } from './index';

@Provide
class App extends Component {
  state = {
    boxes: null
  }
  _randomSpheres(ammount){
    let specs = [];
    for(let i = 0; i<ammount; i++){
      specs.push({
        key: 'bola'+i,
        name: 'bola'+i,
        type: TYPE.SPHERE,
        pos: {x: 500*Math.random() - 250, y: 100*Math.random() - 200, z: 200*Math.random() - 100},
        dim: {radius: 20}
      });
    }
    return specs.map((props) => <Body {...props}/>);
  }
  componentWillMount(){
    this.setState({
      boxes: this._randomSpheres(100)
    });
  }
  render() {
    return (
      <div id = "App">
        <DevTools/>
        <ThreeApp>
          <World
            name = "Paradim"
            G = {10}
          >
            {this.state.boxes}
            <Body
              name = "roof"
              type = {TYPE.BOX}
              pos = {{y: 0}}
              dim = {{width: 800, height: 10, depth: 300}}
              move = {false}
            />
            <Joint
              name = "string"
              type = {TYPE.JOINT_DISTANCE}
              bodies = {['roof', 'bola0']}
              anchors = {[{x: 0, y: 0, z: 0}, {x: 0, y: 100, z: 0}]}
              axes = {[{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 0}]}
              limits = {[500, 550]}
              stiffness = {0.2}
              damping = {0.2}
            />
          </World>
        </ThreeApp>
      </div>
    );
  }
};

export default App;
