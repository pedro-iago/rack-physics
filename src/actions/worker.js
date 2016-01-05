import {SPAWN, SUBSCRIBE, STEP, TERMINATE} from '../Macros';

export function spawn( creators ){
  return {
    type: SPAWN,
    payload: creators
  };
}

export function subscribe( objects ){
  return {
    type: SUBSCRIBE,
    payload: objects
  };
}

export function step( objects ){
  return {
    type: STEP,
    payload: objects
  };
}

export function terminate( id ){
  return {
    type: TERMINATE,
    payload: id
  };
}
