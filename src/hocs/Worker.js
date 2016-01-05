import React, {Component, PropTypes as _} from 'react';
import {store} from './Provide';
import {spawn, terminate} from '../actions/worker';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const Worker = creator => BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    componentWillMount() {
      const {id} = this.props;
      store.dispatch( spawn({ [id]: creator }) );
    }
    componentWillUnmount() {
      const {id} = this.props;
      store.dispatch( terminate(id) );
    }
    render() {
      return Wrapped(this.props);
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Worker');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Worker;
