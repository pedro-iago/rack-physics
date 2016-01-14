import React, {Component, PropTypes as _} from 'react';
import {createStore, combineReducers, compose} from 'redux';
import {persistState} from 'redux-devtools';
import {taskEnhancer} from '../interceptors';
import DevTools from '../apps/DevTools';
import * as reducers from '../reducers';
import * as sagas from '../sagas';

const reducer = combineReducers(reducers);
const finalCreateStore = compose(
  taskEnhancer(sagas),
  DevTools.instrument(),
  persistState(window.location.href.match(
    /[?&]debug_session=([^&]+)\b/
  ))
)(createStore);
export const store = finalCreateStore(reducer);

const Provide = Wrapped => {
  class Wrapper extends Component {
    static childContextTypes = {
      store: _.any
    };
    getChildContext() {
      return {store: store};
    };
    render() {
      return <Wrapped {...this.props}/>;
    };
  }
  return Wrapper;
}

export default Provide;
