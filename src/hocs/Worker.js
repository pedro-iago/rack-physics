import React, {Component, PropTypes as _} from 'react';
import {connect} from 'react-redux';
import {spawn, init, terminate} from '../actions/worker';
import {wrapDisplayName} from '../utils/HocUtils';

const Worker = creator => BaseComponent => {
  @connect()
  class Wrapper extends Component {
    componentWillMount() {
      const {myKey, dispatch, children, ...value} = this.props;
      dispatch( spawn({ [myKey]: creator }) );
      dispatch( init({ [myKey]: value }) );
    }
    componentWillUnmount() {
      const {myKey, dispatch} = this.props;
      dispatch( terminate(myKey) );
    }
    render() {
      return BaseComponent(this.props);
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Worker');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Worker;
