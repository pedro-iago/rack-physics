import React, { Component } from 'react';
import { store } from '../hocs/Provide';
import { RoofWithPendulum } from '../components/custom';
import { Body, Joint, World } from '../containers';
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
        pos: {x: 500*Math.random() - 250, y: 100*Math.random() - 200, z: 200*Math.random() - 100},
        dim: {width: 20, height: 20, depth: 20, radius: 15}
      });
    }
    return specs.map((props) => <Body {...props}/>);
  };
  componentWillMount(){
    this.setState({
      bodies: this._randomBodies(20)
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
          >
            {this.state.bodies}
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
