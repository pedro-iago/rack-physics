import {SPAWN, SETUP, LOOP, TERMINATE} from '../Macros';

export function spawn( creators ){
  return {
    type: SPAWN,
    payload: creators
  };
}

export function setup( objects ){
  return {
    type: SETUP,
    payload: objects
  };
}

export function loop( objects ){
  return {
    type: LOOP,
    payload: objects
  };
}

export function terminate( id ){
  return {
    type: TERMINATE,
    payload: id
  };
}
