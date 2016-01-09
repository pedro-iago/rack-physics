import React, { Component } from 'react';
import { Provide } from '../hocs';
import { RoofWithPendulum } from '../components';
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
        pos: {x: 500*Math.random() - 250, y: 500*Math.random() - 1000, z: 200*Math.random() - 100},
        dim: {radius: 20}
      });
    }
    return specs.map((props) => <Body {...props}/>);
  }
  componentWillMount(){
    this.setState({
      boxes: this._randomSpheres(17)
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
            iterations = {8}
            timestep = {1/60}
          >
            {this.state.boxes}
            <RoofWithPendulum/>
          </World>
        </ThreeApp>
      </div>
    );
  }
};

export default App;
