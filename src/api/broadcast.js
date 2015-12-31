import merge from 'lodash.merge';
import message from './message';

//it looks that it is not time for async now...
//also, deep merge suucks
function broadcast(hashTargets, data){
  return new Promise((resolve, reject) => Promise.all(Object.values(hashTargets).map((target) => message(target, data))).then((responses) => {
    const type = data.type;
    const meta = responses.map( (response) => response.meta );

    let payload = {};
    for(const response of responses){
      for(const key in response.payload){
        payload[key] = {...payload[key], ...response.payload[key]};
      }
    }
    //const payload = merge( {}, ...responses.map( (response) => response.payload ) );

    resolve({ type, meta, payload });
  }).catch((err) => reject(err)));
}

export default broadcast;
