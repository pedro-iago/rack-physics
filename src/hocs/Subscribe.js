import React, {Component, PropTypes as _} from 'react';
import {store} from './Provide';
import {subscribe} from '../actions/worker';
import {wrapDisplayName, wrap} from '../utils/HocUtils';
import pick from 'lodash.pick';

const Subscribe = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    componentWillMount() {
      const {id, children, state, ...initial} = this.props;
      store.dispatch( subscribe({ [id]: initial }) );
    }
    render() {
      const {id, children, state, ...initial} = this.props;
      const withState = React.Children.map( children, (child) =>
        React.cloneElement( child, {
          state: pick( state, (_,key) => key.startsWith(child.props.id) )
        })
      );
      return Wrapped({ ...initial, ...state[id], children: withState });
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Subscribe');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export default Subscribe;
