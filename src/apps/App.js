import React, { Component } from 'react';
import { store } from '../hocs/Provide';
import { RoofWithPendulum } from '../components/custom';
import World, { Body, Joint } from '../containers/World';
import * as TYPE from '../Macros';
import { ThreeApp, DevTools } from './index';

class App extends Component {
  state = {
    boxes: null
  };
  types = [TYPE.CYLINDER, TYPE.SPHERE, TYPE.BOX];
  _randomBodies(ammount){
    let specs = [];
    for(let i = 0; i<ammount; i++){
      specs.push({
        key: 'body'+i,
        name: 'body'+i,
        type: this.types[Math.floor(3*Math.random())],
        pos: {x: 500*Math.random() - 250, y: 500*Math.random() - 1000, z: 200*Math.random() - 100},
        dim: {width: 20, height: 20, depth: 20, radius: 15}
      });
    }
    return specs.map((props) => <Body {...props}/>);
  };
  componentWillMount(){
    this.setState({
      boxes: this._randomBodies(20)
    });
  };
  render() {
    return (
      <div id = "App">
        <DevTools store = {store}/>
        <ThreeApp>
          <World
            name = "Paradim"
            G = {10}
            iterations = {8}
            timestep = {1/60}
          >
            {this.state.boxes}
            <RoofWithPendulum
              name = "thing"
              pos = {{x: 250}}
            />
          </World>
        </ThreeApp>
      </div>
    );
  };
};

export default App;
