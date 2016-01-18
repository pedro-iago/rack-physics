import React, { PropTypes as _ } from 'react';
import { compose } from 'redux';
import { Provide, Root, Namespace, Worker, Transform } from '../hocs';
import Body from '../containers/Body';
import { Oimo as Physics } from '../workers';
import { BRUTE, SWEEP, TREE } from '../Macros';

const Controller = Worker(Physics)(Body);
const World = compose(Provide, Root)(
  ( props ) =>
    <Body {...props}>
      {props.children}
      <Controller/>
    </Body>
);

World.propTypes = {
  G: _.number,
  iterations: _.number,
  timestep: _.number,
  broadphase: _.oneOf([BRUTE, SWEEP, TREE])
};

World.defaultProps = {
  G: 10,
  iterations: 8,
  timestep: 1/60,
  broadphase: SWEEP
}

export default World;
