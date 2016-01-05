var counter = 0;
function message(target, data){
  return new Promise((resolve, reject) => {
    target.onmessage = (response) => {
      console.log("message", counter++);
      resolve(response.data);
    };
    target.postMessage(data);
  });
};

export default message;
