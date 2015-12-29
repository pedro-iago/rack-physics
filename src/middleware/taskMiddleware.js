export const QUEUE = 'QUEUE';
export function queue( task ){
  return {
    type: QUEUE,
    payload: task
  };
};

export default store => next => action => {
  const result = next(queue(action));
  return result;
}
