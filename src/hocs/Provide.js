import React, {Component, PropTypes as _} from 'react';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {persistState} from 'redux-devtools';
import sagaMiddleware from 'redux-saga';
import taskMiddleware, {TaskReducer, batchedSubscribePR, QUEUE} from '../middleware/taskMiddleware';
import DevTools from '../apps/DevTools';
import {batchedSubscribe} from 'redux-batched-subscribe';
import {unstable_batchedUpdates as batchedUpdates} from 'react-dom';
import * as reducers from '../reducers';
import sagas from '../sagas';
import {wrapDisplayName} from "../utils/HocUtils";

const reducer = combineReducers({...reducers, TaskReducer});
const finalCreateStore = compose(
  applyMiddleware( taskMiddleware ),
  applyMiddleware( sagaMiddleware(...sagas) ),
  DevTools.instrument(),
  persistState(window.location.href.match(
    /[?&]debug_session=([^&]+)\b/
  )),
  batchedSubscribePR((notify, actionDev) => {
    if(actionDev.action.type !== QUEUE)
      requestAnimationFrame(notify);
  })
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
