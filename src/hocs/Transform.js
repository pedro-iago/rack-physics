import React, {PropTypes as _} from 'react';
import _c from '../utils/CustomPropTypes';
import {wrapDisplayName} from "../utils/HocUtils";
import {Vec3} from '../utils/VectorUtils';

const Transform = BaseComponent => {
  const Wrapper = props => {
    const {pos, rot, children} = props;
    const withOffset = React.Children.map(children, child =>
      React.cloneElement(child, {
        pos: Vec3.add(child.pos, pos),
        rot: Vec3.add(child.rot, rot)
      })
    );
    return BaseComponent({...props, children: withOffset});
  };

  Wrapper.displayName = wrapDisplayName(BaseComponent, 'Transform');
  Wrapper.propTypes = {
    ...BaseComponent.propTypes,
    pos: _c.vec3,
    rot: _c.vec3,
    children: _.any
  };
  Wrapper.defaultProps = {
    pos: {x: 0, y: 0, z: 0},
    rot: {x: 0, y: 0, z: 0},
    ...BaseComponent.defaultProps
  }

  return Wrapper;
}

export default Transform;
