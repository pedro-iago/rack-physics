import React, {Component, PropTypes as _} from 'react';
import {store} from './Provide';
import {setup} from '../actions/worker';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const View = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    static contextTypes = {
      id: _.string.isRequired,
      state: _.any.isRequired
    }
    componentWillMount() {
      const {children, ...initial} = this.props;
      const {id} = this.context;
      store.dispatch( setup({ [id]: initial }) );
    }
    render() {
      const {children, ...initial} = this.props;
      const {id, state} = this.context;
      return Wrapped({ ...initial, ...state[id], children });
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'View');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default View;
