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

// function render(){
//   ReactDOM.render(
//     <App />,
//     document.getElementById("root")
//   );
//   requestAnimationFrame(render);
// }
// requestAnimationFrame(render);

// //this is pretty interesting in that it makes the result dispatch to run in the requestAnimationFrame of react-three-renderer
// let ReactUpdates = require('react/lib/ReactUpdates');
// var fcfsBatchingStrategy = {
//   isBatchingUpdates: true,
//   batchedUpdates: function(callback, a, b, c, d, e) {
//     callback(a, b, c, d, e);
//     ReactUpdates.flushBatchedUpdates();
//     //this is a possible place for requesting another three js frame
//   }
// };
// ReactUpdates.injection.injectBatchingStrategy(fcfsBatchingStrategy);

// let ReactUpdates = require('react/lib/ReactUpdates');
// var rafBatchingStrategy = {
//   isBatchingUpdates: true,
//   batchedUpdates: function(callback, param) {
//     callback(param);
//   }
// };
// var tick = function() {
//   ReactUpdates.flushBatchedUpdates();
//   requestAnimationFrame(tick);
// };
// requestAnimationFrame(tick);
// ReactUpdates.injection.injectBatchingStrategy(rafBatchingStrategy);

window.onbeforeunload = () => ReactDOM.unmountComponentAtNode(
  document.getElementById("root")
);
window.onkeydown = () => {
  Perf.stop();
  const measurements = Perf.getLastMeasurements();
  Perf.printInclusive(measurements);
  Perf.printExclusive(measurements);
  Perf.printWasted(measurements);
}
