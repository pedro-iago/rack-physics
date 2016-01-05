import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';
import message from './message';

// async function broadcast(targets, data){
//   const responses = await* Object.values(mapValues(targets, (target, key) => message(target, filter(data, key))));
//   const type = data.type;
//   const meta = responses.map( (response) => response.meta );
//   let payload = {};
//   for(const response of responses){
//     if(typeof(response.payload)==='object')
//       for(const key in response.payload)
//         payload[key] = {...payload[key], ...response.payload[key]};
//   }
//   return { type, meta, payload };
// }

//it looks that it is not time for async now...
function broadcast(targets, data){
  return new Promise((resolve, reject) => Promise.all(Object.values(
    mapValues(targets, (target, key) => message(target, filter(data, key))) ))
    .then((responses) => {
      const type = data.type;
      const meta = responses.map( (response) => response.meta );
      let payload = {};
      for(const response of responses){
        if(typeof(response.payload)==='object')
          for(const key in response.payload)
            payload[key] = {...payload[key], ...response.payload[key]};
      }
      resolve({ type, meta, payload });
    }).catch((err) => reject(err)));
}

function filter(data, key){
  const payload = data.payload? pick(data.payload, (_, id) => id.startsWith(key))
                              : key;
  return {...data, payload};
}

export default broadcast;
