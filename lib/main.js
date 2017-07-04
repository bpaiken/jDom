const DOMNodeCollection = require('./dom_node_collection');

const docReadyQueue = [];

window.$l = function(arg) {
  switch (typeof arg) {
    case 'function':
      registerDocReadyCallback(arg);
      break;
    case 'string':
      return new DOMNodeCollection(
        Array.from(document.querySelectorAll(arg))
      );
    case 'object':
      if(arg instanceof HTMLElement){
        return new DomNodeCollection([arg]);
      }
  }
};

$l.extend  = function (...args) {
  return Object.assign(...args);
};

$l.ajax = options => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET"){
    options.url += "?" + toQueryString(options.data);
  }

  request.open(options.method, options.url, true);
  request.onload = e => {
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
};

toQueryString = obj => {
  let result = "";
  for(let prop in obj){
    if (obj.hasOwnProperty(prop)){
      result += prop + "=" + obj[prop] + "&";
    }
  }
  return result.substring(0, result.length - 1);
};

registerDocReadyCallback = func => {
  if(!_docReady){
    docReadyQueue.push(func);
  } else {
    func();
  }
};