import React, {Component, PropTypes as _} from 'react';
import {connect} from 'react-redux';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const Root = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    static childContextTypes = {
      id: _.string,
      state: _.any
    };
    getChildContext() {
      const {state} = this.props;
      return {id: "@root", state};
    };
    render() {
      const {state, ...original} = this.props;
      return Wrapped(original);
    };
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Root');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return connect((state) => ({state: state.ViewReducer}), {})(Wrapper);
}

export default Root;
