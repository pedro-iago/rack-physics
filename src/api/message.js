function message(target, data){
  return new Promise((resolve, reject) => {
    const listener = function( event ) {
      const { data: response } = event;
      if( response.type === data.type ) {
        response.error?
          reject(response) : resolve(response);
        target.removeEventListener('message', listener);
        event.stopImmediatePropagation();
      }
    }
    target.addEventListener('message', listener);
    target.postMessage(data);
  });
};

export default message;
