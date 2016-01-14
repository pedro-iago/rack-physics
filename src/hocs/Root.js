import React, {Component, PropTypes as _} from 'react';
import {connect} from 'react-redux';
import {setup} from '../actions/worker';

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
    componentDidMount(){
      const {dispatch} = this.props;
      const inst = this.refs["obj3D"];
      dispatch( setup({ "@root": inst }) );
    }
    render() {
      const {state, dispatch, ...rest} = this.props;
      return (
        <object3D
          ref = "obj3D"
          name = "@root"
        >
          <Wrapped {...rest}/>
        </object3D> );
    };
  }
  return connect((state) => ({state: state.ViewReducer}))(Wrapper);
}

export default Root;
