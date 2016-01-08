import React, {Component, PropTypes as _} from 'react';
import {store} from './Provide';
import {subscribe} from '../actions/worker';
import {wrapDisplayName, wrap} from '../utils/HocUtils';
import pick from 'lodash.pick';

const Subscribe = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    static contextTypes = {
      id: _.string,
      state: _.any
    }
    componentWillMount() {
      const {children, ...initial} = this.props;
      const {id} = this.context;
      store.dispatch( subscribe({ [id]: initial }) );
    }
    render() {
      const {children, ...initial} = this.props;
      const {id, state} = this.context;
      return Wrapped({ ...initial, ...state[id], children });
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Subscribe');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Subscribe;
