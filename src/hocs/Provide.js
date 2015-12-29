import React, {Component, PropTypes as _} from 'react';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {persistState} from 'redux-devtools';
import sagaMiddleware from 'redux-saga';
import {taskMiddleware} from '../middleware';
import DevTools from '../apps/DevTools';
import * as reducers from '../reducers';
import sagas from '../sagas';
import {wrapDisplayName} from "../utils/HocUtils";

const reducer = combineReducers(reducers);
const finalCreateStore = compose(
  applyMiddleware( taskMiddleware ),
  applyMiddleware( sagaMiddleware(...sagas) ),
  DevTools.instrument(),
  persistState(window.location.href.match(
    /[?&]debug_session=([^&]+)\b/
  ))
)(createStore);
export const store = finalCreateStore(reducer);

const Provide = BaseComponent => {
  class Wrapper extends Component {
    static childContextTypes = {
      store: _.any
    }
    getChildContext() {
      return {store: store};
    }
    render() {
      return <BaseComponent {...this.props}/>;
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Provide');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Provide;
