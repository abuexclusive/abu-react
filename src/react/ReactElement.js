import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';

// 是用来检测属性是否为对象的自有属性，如果是，返回true，否者false，只会检查对象的自有属性，对象原形上的属性其不会检测
const hasOwnProperty = Object.prototype.hasOwnProperty;

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

const ReactElement = function(type, key, ref, props) {
  const element = {
    type,
    key,
    ref,
    props,
    $$typeof: REACT_ELEMENT_TYPE,
  };
  return element;
}

function hasValidRef(config) {
  return config.ref !== undefined;
}

function hasValidKey(config) {
  return config.key !== undefined;
}

/**
 * @return {type, key, ref, props} 其中children包含在props
 */
export function createElement(type, config, children) {
  // console.log(arguments);

  let propName;

  const props = {};
  let key = null;
  let ref = null;

  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = config.key;
    }

    // 将config中除了key、ref属性添加到props
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) && 
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 只有一个子元素
    props.children = children;
  } else if (childrenLength > 1) {
    // 有多个子元素
    const childArray = new Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i+2];
    }
    props.children = childArray;
  }

  return ReactElement(type, key, ref, props);
}