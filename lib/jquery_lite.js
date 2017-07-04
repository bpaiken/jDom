/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function DOMNodeCollection(array) {
  this.nodes = array;
}

DOMNodeCollection.prototype.each = function (cb) {
  return this.nodes.forEach(cb);
};

DOMNodeCollection.prototype.on = function (eventName, cb) {
  this.each(node => {
    node.addEventListener(eventName, cb);
    const eventKey = `jDomEvents-${eventName}`
    if (typeof node[eventKey] === 'undefined') {
      node[eventKey] = [];
    }
    node[eventKey].push(cb);
  })
};

DomNodeCollection.prototype.off = function (eventName, cb) {
  this.each(node => {
    const eventKey = `jDomEvents-${eventName}`;
    if (node[eventKey]) {
      node[eventKey].forEach(cb => {
        node.removeEventListener(eventName, cb);
      });
    }
    node[eventKey] = [];
  });
};

DOMNodeCollection.prototype.html = function (string) {
  if (typeof string === 'string') {
    this.each(node => node.innerHTML = string);
  } else {
    return this.nodes[0].innerHTML;
  }
};

DOMNodeCollection.prototype.empty = function () {
  this.html('');
};

DOMNodeCollection.prototype.append = function (arg) {
    if (typeof arg === 'string') {
      this.each(node => node.innerHTML += arg);
    } else if (arg instanceof HTMLElement) {
      this.each((node) => node.innerHTML += arg.outerHTML);

    } else if (arg instanceof DOMNodeCollection) {
        arg.each(el => {
          this.each(node => {
            node.innerHTML += el.outerHTML;
          });
        });
      }
  };

DOMNodeCollection.prototype.attr = function (key,value) {
  if (value) this.each(node => node.setAttribute(key,value));
  else return this.nodes[0].getAttribute(key);
};

DOMNodeCollection.prototype.addClass = function (newClass) {
  this.each(node => node.classList.add(newClass))
};

DOMNodeCollection.prototype.removeClass = function (oldClass) {
  this.each(node => node.classList.remove(oldClass));
};

DOMNodeCollection.prototype.children = function () {
  let childrenNodes = [];
  this.each(node => {
    childrenNodes = childrenNodes.concat(Array.from(node.children));
  });
  return new DOMNodeCollection(childrenNodes);
};

DOMNodeCollection.prototype.parent = function () {
  const parentNodes = [];
    
  this.each(({ parentNode }) => 
  parentNode.visited ? parentNodes.push(parentNode) : parentNode.visited = true
  )

  parentNodes.forEach(node => node.visited = false)
  return new DomNodeCollection(parentNodes);
};

DOMNodeCollection.prototype.find = function (selector) {
  let foundNodes = [];
  this.each((node) => {
    const nodeList = node.querySelectorAll(selector);
    foundNodes = foundNodes.concat(Array.from(nodeList));
  });
  return new DomNodeCollection(foundNodes);
};

DOMNodeCollection.prototype.remove = function (oldClass) {
  this.each(node => node.classList.remove(oldClass));
};

DOMNodeCollection.prototype.on = function(eType, callback) {
  this.each(node => {
    node[eType] = callback;
    node.addEventListener(eType, callback);
  });
};

DOMNodeCollection.prototype.off = function (eType) {
  this.each(node => {
    let callback = node[eType];
    node.removeEventListener(eType, callback);
  });
};

module.exports = DOMNodeCollection;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(0);

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

/***/ })
/******/ ]);