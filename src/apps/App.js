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
  _randomBoxes(ammount){
    let specs = [];
    for(let i = 0; i<ammount; i++){
      specs.push({
        key: 'caixa'+i,
        name: 'caixa'+i,
        type: TYPE.BOX,
        pos: {x: 5000*Math.random() - 2500, y: 1000*Math.random() - 2000, z: 2000*Math.random() - 1000},
        dim: {width: 200, height: 200, depth: 200}
      });
    }
    return specs.map((props) => <Body {...props}/>);
  }
  componentWillMount(){
    this.setState({
      boxes: this._randomBoxes(100)
    });
  }
  render() {
    return (
      <div id = "App">
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
              dim = {{width: 8000, height: 100, depth: 3000}}
              move = {false}
            />
            <Joint
              name = "string"
              type = {TYPE.JOINT_DISTANCE}
              bodies = {['roof', 'caixa0']}
              anchors = {[{x: 0, y: 0, z: 0}, {x: 0, y: 2000, z: 0}]}
              axes = {[{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 0}]}
              limits = {[2000, 2000]}
              stiffness = {1/2}
              damping = {0.8}
            />
          </World>
        </ThreeApp>
      </div>
    );
  }
};

export default App;
