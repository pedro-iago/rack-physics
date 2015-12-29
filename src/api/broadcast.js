import merge from 'lodash.merge';
import message from './message';

async function broadcast(hash, data){
  const targets = Object.values(hash);
  const responses = await* targets.map( async (target) => await message(target, data) );
  const type = data.type;
  const meta = responses.map( (response) => response.meta );
  const payload = merge( {}, ...responses.map( (response) => response.payload ) );
  return { type, meta, payload };
}

export default broadcast;
