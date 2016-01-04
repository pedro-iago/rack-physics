import React, {Component, PropTypes as _} from 'react';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {persistState} from 'redux-devtools';
import {batchedSubscribe} from 'redux-batched-subscribe';
import {unstable_batchedUpdates as batchedUpdates} from 'react-dom';
import {TaskHandler} from '../interceptors';
import DevTools from '../apps/DevTools';
import * as reducers from '../reducers';
import * as sagas from '../sagas';
import {wrapDisplayName} from "../utils/HocUtils";

const reducer = combineReducers(reducers);
const finalCreateStore = compose(
  TaskHandler(sagas),
  DevTools.instrument(),
  persistState(window.location.href.match(
    /[?&]debug_session=([^&]+)\b/
  )),
  batchedSubscribe(()=>{})
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
