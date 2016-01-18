import React, {Component, PropTypes as _} from 'react';

var count = 0;
const Namespace = Wrapped => {
  class Wrapper extends Component {
    static propTypes = {
      name: _.string
    };
    static defaultProps = {
      name: count++
    };
    static contextTypes = {
      id: _.string.isRequired
    };
    static childContextTypes = {
      id: _.string
    };
    getChildContext() {
      return { id: uniqueUnion(this.props.name, this.context.id) };
    };
    render() {
      return <Wrapped {...this.props}/>;
    };
  }
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
