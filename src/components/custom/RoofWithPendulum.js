import React, { PropTypes as _ } from 'react';
import _c from '~/utils/CustomPropTypes';
import { Body, Joint } from '~/containers';
import * as TYPE from '~/Macros';

const RoofWithPendulum = (props) =>
  <Body
    {...props}
  >
    <Body
      pos = {{x: -250}}
      name = "pei"
    >
      <Body
        name = "caixa"
        type = {TYPE.BOX}
        pos = {{x: 0, y: -20, z: 0}}
        dim = {{width: 20, height: 20, depth: 20}}
      />
    </Body>
    <Body
      name = "roof"
      type = {TYPE.BOX}
      pos = {{y: 0}}
      dim = {{width: 500, height: 10, depth: 300}}
      dynamic = {false}
    />
    <Body
      name = "bola"
      type = {TYPE.SPHERE}
      pos = {{x: 300, y: -400, z: 0}}
      dim = {{radius: 20}}
    />
    <Joint
      name = "string"
      type = {TYPE.JOINT_DISTANCE}
      bodies = {['roof', 'bola']}
      anchors = {[{x: 0, y: 0, z: 0}, {x: 0, y: 20, z: 0}]}
      axis = {[{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 0}]}
      limits = {[500, 550]}
      stiffness = {0.2}
      damping = {1.5}
    />
  </Body>

export default RoofWithPendulum;
