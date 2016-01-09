import pick from 'lodash.pick';
import mapValues from 'lodash.mapValues';
import message from './message';

async function broadcast(targets, data){
  const responses = await* Object.values(mapValues(targets, (target, id) => message(target, filter(data, id))));
  const type = data.type;
  const meta = responses.map( (response) => response.meta );
  let payload = {};
  for(const response of responses){
    if(typeof(response.payload)==='object')
      for(const key in response.payload)
        payload[key] = {...payload[key], ...response.payload[key]};
  }
  return { type, meta, payload };
}

function filter(data, id){
  const type = data.type;
  const meta = id;
  const payload = pick(data.payload, (_, key) => key.startsWith(id));
  return {type, meta, payload};
}

export default broadcast;
