import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import {App} from './src/apps';

window.perf = Perf;
Perf.start();

ReactDOM.render(
  <App />,
  document.getElementById("root")
);

// window.onbeforeunload = () => ReactDOM.unmountComponentAtNode(
//   document.getElementById("root")
// );
window.onkeydown = () => {
  Perf.stop();
  const measurements = Perf.getLastMeasurements();
  Perf.printInclusive(measurements);
  Perf.printExclusive(measurements);
  Perf.printWasted(measurements);
}
