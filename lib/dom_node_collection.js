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
