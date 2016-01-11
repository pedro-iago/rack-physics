import React, { PropTypes as _ } from 'react';
import { compose } from 'redux';
import { Namespace, Transform } from '../hocs';
import { JointMesh } from '../components/core';

const Joint = compose(Namespace, Transform)(JointMesh);

Joint.propTypes = {
  bodies: _.arrayOf(_.string).isRequired,
  distance: _.number,
  damping: _.number,
  stiffness: _.number,
  maxForce: _.number
}

Joint.defaultProps = {
  distance: 0,
  damping: 0.8,
  stiffness: 0.5,
  maxForce: 1e16
}

export default Joint;
