import React, {PropTypes as _} from 'react';
import {wrapDisplayName, wrap} from '../utils/HocUtils';

const Namespace = BaseComponent => {

  const Wrapped = wrap(BaseComponent);
  const Wrapper = props => {
    const {id, children, ...base} = props;
    const withId = React.Children.map( children, (child) =>
      React.cloneElement( child, { id: uniqueUnion(child.props.name, id) } )
    );
    return Wrapped({ ...base, id, children: withId });
  };

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Namespace');
  Wrapper.propTypes = {
    ...BaseComponent.propTypes,
    name: _.string.isRequired
  };
  Wrapper.defaultProps = {
    ...BaseComponent.defaultProps,
    id: "@root"
  }

  return Wrapper;
};

export function uniqueUnion(name, parent){
  if( name.includes(',') )
    throw new Error("name can't have any commas!");
  return parent? [parent, name].join(',') : name;
}

export function getParent(id){
  return id.substring(0, id.lastIndexOf(','));
}

export default Namespace;
