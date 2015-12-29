import React, {Component, PropTypes as _} from 'react';
import {connect} from 'react-redux';
import {subscribe} from '../actions/worker';
import {wrapDisplayName} from '../utils/HocUtils';

const Subscribe = BaseComponent => {
  @connect( (state, props) => state.ViewReducer[props.myKey] || {} )
  class Wrapper extends Component {
    componentWillMount() {
      const {myKey, dispatch, children, ...value} = this.props;
      dispatch( subscribe({ [myKey]: value }) );
    }
    render() {
      return BaseComponent(this.props);
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Subscribe');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Subscribe;
