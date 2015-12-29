import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './src/apps';

ReactDOM.render(
  <App />,
  document.getElementById("root")
);

window.onbeforeunload = () => ReactDOM.unmountComponentAtNode(
  document.getElementById("root")
);
