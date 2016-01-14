import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { BOX, SPHERE, CYLINDER } from '~/Macros';

const BodyGeometry = ( {type, dim, dynamic} ) => {switch(type){
  case BOX:
    return <boxGeometry
      width = {dim.width}
      height = {dim.height}
      depth = {dim.depth}
      dynamic = {dynamic}
    />;
  case SPHERE:
    return <sphereGeometry
      radius = {dim.radius}
      dynamic = {dynamic}
    />;
  case CYLINDER:
    return <cylinderGeometry
      height = {dim.height}
      radiusTop = {dim.radius}
      radiusBottom = {dim.radius}
      dynamic = {dynamic}
    />;
  default:
    return;
}};

BodyGeometry.propTypes = {
  type: _.oneOf([BOX, SPHERE, CYLINDER]).isRequired,
  dim: _c.dim.isRequired,
  dynamic: _.bool.isRequired
}

export default BodyGeometry;
