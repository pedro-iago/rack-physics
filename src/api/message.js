function message(target, data){
  return new Promise((resolve, reject) => {
    target.onmessage = (response) => {
      resolve(response.data);
    };
    target.postMessage(data);
  });
};

export default message;
