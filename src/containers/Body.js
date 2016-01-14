import React, { PropTypes as _ } from 'react';
import { compose } from 'redux';
import { Namespace, Transform } from '../hocs';
import { BodyMesh } from '../components/core';

const Body = compose(Namespace, Transform)(BodyMesh);

Body.propTypes = {
  density: _.number,
  friction: _.number,
  restituition: _.number
}

Body.defaultProps = {
  density: 1,
  friction: 0.4,
  restitution: 0.2
}

export default Body;
