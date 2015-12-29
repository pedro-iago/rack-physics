import React from 'react';
import THREE from 'three.js';

//see react/src/ReactTestUtils
const instanceMapGet = (inst) => inst._reactInternalInstance;
const isTHREEComponent = (inst) => inst instanceof THREE.Object3D;
const isDOMComponent = (inst) => !!(inst && inst.nodeType === 1 && inst.tagName);
const findAllInRenderedTreeInternal = (inst, test) => {
  if (!inst || !inst.getPublicInstance) {
    return [];
  }
  var publicInst = inst.getPublicInstance();
  var ret = test(publicInst) ? [publicInst] : [];
  var currentElement = inst._currentElement;
  if (isTHREEComponent(publicInst) || isDOMComponent(publicInst)) {
    var renderedChildren = inst._renderedChildren;
    var key;
    for (key in renderedChildren) {
      if (!renderedChildren.hasOwnProperty(key)) {
        continue;
      }
      ret = ret.concat(
        findAllInRenderedTreeInternal(
          renderedChildren[key],
          test
        )
      );
    }
  } else if (
    React.isValidElement(currentElement) &&
    typeof currentElement.type === 'function'
  ) {
    ret = ret.concat(
      findAllInRenderedTreeInternal(inst._renderedComponent, test)
    );
  }
  return ret;
}

const ReactThreeUtils = {
  getComponentOf: function(inst) {
    if(inst !== undefined)
      return inst._reactInternalInstance._currentElement.type;
  },
  getOwnerOf: function(inst) {
    return inst._reactInternalInstance._currentElement._owner._instance;
  },
  isCompositeComponent: function(inst) {
    if (isTHREEComponent(inst) || isDOMComponent(inst)) {
      return false;
    }
    return inst != null &&
           typeof inst.render === 'function' &&
           typeof inst.setState === 'function';
  },
  findAllInRenderedTree: function(inst, test) {
    if (!inst) {
      return [];
    }
    return findAllInRenderedTreeInternal(instanceMapGet(inst), test);
  }
};

export default ReactThreeUtils;
