function message(target, data){
  return new Promise((resolve, reject) => {
    target.onmessage = (response) => {
      console.log("message");
      resolve(response.data);
    };
    target.postMessage(data);
  });
};

export default message;
