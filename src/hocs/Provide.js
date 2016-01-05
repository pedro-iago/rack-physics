import React, {Component, PropTypes as _} from 'react';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {persistState} from 'redux-devtools';
import {batchedSubscribe} from 'redux-batched-subscribe';
import {taskEnhancer} from '../interceptors';
import DevTools from '../apps/DevTools';
import * as reducers from '../reducers';
import * as sagas from '../sagas';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const reducer = combineReducers(reducers);
const finalCreateStore = compose(
  taskEnhancer(sagas),
  DevTools.instrument(),
  persistState(window.location.href.match(
    /[?&]debug_session=([^&]+)\b/
  ))
)(createStore);
export const store = finalCreateStore(reducer);

const Provide = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    static childContextTypes = {
      store: _.any
    }
    getChildContext() {
      return {store: store};
    }
    render() {
      return Wrapped(this.props);
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Provide');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Provide;
