import {SPAWN, SETUP, LOOP, TERMINATE} from '../Macros';

export function spawn( creators ){
  return {
    type: SPAWN,
    payload: creators
  };
}

//maybe i'll have to rethink these actions to receive the three js root instead
//the only difference between then would be the ammount of times I call them

//setup would be requested just once, on the world creation
export function setup( objects ){
  return {
    type: SETUP,
    payload: objects
  };
}

//loop would requested on each animation frame
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
