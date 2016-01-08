import React, {Component, PropTypes as _} from 'react';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const Namespace = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  class Wrapper extends Component {
    static contextTypes = {
      id: _.string
    }
    static childContextTypes = {
      id: _.string
    }
    getChildContext() {
      return {
        id: uniqueUnion(this.props.name, this.context.id)
      }
    }
    render() {
      return Wrapped(this.props);
    }
  }

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Namespace');
  Wrapper.propTypes = BaseComponent.propTypes;
  Wrapper.defaultProps = BaseComponent.defaultProps;

  return Wrapper;
}

export function uniqueUnion(name, parent){
  if( name.includes(',') )
    throw new Error("name can't have any commas!");
  return parent? [parent, name].join(',') : name;
}

export function getParent(id){
  return id.substring(0, id.lastIndexOf(','));
}

export default Namespace;
