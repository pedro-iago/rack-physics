import React from 'react';

export const wrapDisplayName = function(Component, hocName){
  let BaseName = '';
  if (typeof Component === 'string') {
    BaseName = Component
  }
  else
    BaseName = Component.displayName || Component.name || 'Component';
  return `${hocName}(${BaseName})`;
}

export const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)

export const wrap = (Component) =>
  isClassComponent(Component)? (props) => <Component {...props}/>
                                 : (props) => Component(props);

const HocUtils = {
  wrapDisplayName,
  isClassComponent,
  wrap
};

export default HocUtils;
