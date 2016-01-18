//import React from 'react';
//import ReactDOMServer from 'react-dom/server';
//import {App} from './src/apps';

//console.log(ReactDOMServer.renderToString(<App />));
//I actually need React3RendererServer.renderToString(<App />)
//or something like it, sending the markups each time

//i guess this can be done from index.js, send the markup to all the workers and have them call
//var three = React3Renderer.render(markup), to get the latest view, (markup looks like the one viewed in React DevTools)
//of course markup should have only the three js elements and perferably any userData as their userData props (React3 doesn't supports that yet)
