import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { Body, Joint } from '~/containers/World';
import * as TYPE from '~/Macros';

const RoofWithPendulum = (props) =>
  <Body
    {...props}
  >
    <Body
      name = "roof"
      type = {TYPE.BOX}
      pos = {{y: 0}}
      dim = {{width: 800, height: 10, depth: 300}}
      move = {false}
    />
    <Body
      name = "bola"
      type = {TYPE.SPHERE}
      pos = {{x: 300, y: 400, z: 0}}
      dim = {{radius: 20}}
    />
    <Joint
      name = "string"
      type = {TYPE.JOINT_DISTANCE}
      bodies = {['roof', 'bola']}
      anchors = {[{x: 0, y: 0, z: 0}, {x: 0, y: 10, z: 0}]}
      axes = {[{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 0}]}
      limits = {[500, 550]}
      stiffness = {0.2}
      damping = {0.2}
    />
  </Body>

RoofWithPendulum.propTypes = Body.propTypes;
RoofWithPendulum.defaultProps = Body.defaultProps;  

export default RoofWithPendulum;
