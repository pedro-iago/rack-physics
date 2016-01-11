import React, {Component, PropTypes as _} from 'react';
import {connect} from 'react-redux';

const Root = Wrapped => {
  class Wrapper extends Component {
    static propTypes = {
      state: _.any.isRequired
    };
    static childContextTypes = {
      id: _.string,
      state: _.any
    };
    getChildContext() {
      const {state} = this.props;
      return {id: "@root", state};
    };
    render() {
      const {state, ...rest} = this.props;
      return <Wrapped {...rest}/>;
    };
  }
  return connect((state) => ({state: state.ViewReducer}), {})(Wrapper);
}

export default Root;
