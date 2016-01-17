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
    return <sphereGeometry/>;
}};

BodyGeometry.propTypes = {
  type: _.oneOf([BOX, SPHERE, CYLINDER]),
  dim: (...args) => {
    const s = _c.dim;
    return args[0].type? s.isRequired(...args) : s(...args);
  },
  dynamic: _.bool
}

export default BodyGeometry;
