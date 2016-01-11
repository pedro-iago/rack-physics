import React, { PropTypes as _ } from 'react';

const WorldMesh = ({children}) =>
  <object3D>{children}</object3D>;

WorldMesh.propTypes = {
  children: _.any
}

export default WorldMesh;
