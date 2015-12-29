import React, {PropTypes as _} from 'react';
import {wrapDisplayName} from "../utils/HocUtils";

const Namespace = BaseComponent => {
  const Wrapper = props => {
    const {myKey, children, ...base} = props;
    const withKey = React.Children.map( children, (child) =>
      React.cloneElement( child, { myKey: uniqueUnion(child.props.name, myKey) } )
    );
    return BaseComponent({ ...base, children: withKey });
  };

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Namespace');
  Wrapper.propTypes = {
    ...BaseComponent.propTypes,
    name: _.string.isRequired,
    children: _.any
  };
  Wrapper.defaultProps = {
    ...BaseComponent.defaultProps,
    myKey: "@root"
  }

  return Wrapper;
};

export function uniqueUnion(name, parent){
  if( name.includes(',') )
    throw new Error("name can't have any commas!");
  return parent? [parent, name].join(',') : name;
}

export default Namespace;
