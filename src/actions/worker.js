import {SPAWN, INIT, SUBSCRIBE, STEP, TERMINATE} from '../Macros';

export function spawn( creators ){
  return {
    type: SPAWN,
    payload: creators
  };
}

export function init( settings ){
  return {
    type: INIT,
    payload: settings
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

export function terminate( key ){
  return {
    type: TERMINATE,
    payload: key
  };
}
