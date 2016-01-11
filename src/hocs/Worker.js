import React, {Component, PropTypes as _} from 'react';
import {store} from './Provide';
import {spawn, terminate} from '../actions/worker';

const Worker = creator => Wrapped => {
  class Wrapper extends Component {
    static contextTypes = {
      id: _.string.isRequired
    };
    componentWillMount() {
      const {id} = this.context;
      store.dispatch( spawn({ [id]: creator }) );
    };
    componentWillUnmount() {
      const {id} = this.context;
      store.dispatch( terminate(id) );
    };
    render() {
      return <Wrapped {...this.props}/>;
    };
  }
  return Wrapper;
}

export default Worker;
