import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { BOX, SPHERE, CYLINDER } from '~/Macros';

const BodyGeometry = ( {type, dim, dynamic} ) => {
  const {width, height, depth, radius, radiusTop = radius, radiusBottom = radius} = dim;
  const geometries = {
    [BOX]:
      <boxGeometry
        width = {width}
        height = {height}
        depth = {depth}
        dynamic = {dynamic}
      />,
    [SPHERE]:
      <sphereGeometry
        radius = {radius}
        dynamic = {dynamic}
      />,
    [CYLINDER]:
      <cylinderGeometry
        height = {height}
        radiusTop = {radiusTop}
        radiusBottom = {radiusBottom}
        dynamic = {dynamic}
      />
  };
  return geometries[type];
}

BodyGeometry.propTypes = {
  type: _.oneOf([BOX, SPHERE, CYLINDER]).isRequired,
  dim: _c.dim.isRequired,
  dynamic: _.bool.isRequired
}

export default BodyGeometry;
