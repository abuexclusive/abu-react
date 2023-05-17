import { setValueForProperty } from "./DOMPropertyOperations";

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
const AUTOFOCUS = 'autoFocus';
const CHILDREN = 'children';
const STYLE = 'style';


function setInitialDOMProperties(tag, domElement, nextProps) {
  // console.log(tag, domElement, nextProps);
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    // propKey key
    // nextProp value
    const nextProp = nextProps[propKey];
    if (propKey === STYLE) {
      
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
     
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        setTextContent(domElement, nextProp);
      }
    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {
      // Noop
    } else if (propKey === AUTOFOCUS) {

    } else if (nextProp != null) {
      // 除了 style children 之外的 其他属性 
      setValueForProperty(domElement, propKey, nextProp);
    }
  }
}

function setTextContent(node, text) {
  node.textContent = text;
}


export function createElement(type, props) {
  const domElement = document.createElement(type);
  return domElement;
}

export function setInitialProperties(domElement, tag, rawProps) {
  setInitialDOMProperties(tag, domElement, rawProps);
}


export function updateProperties(domElement, updatePayload) {
  for (let i = 0; i < updatePayload.length; i+=2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i+1];
    if (propKey === STYLE) {

    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {

    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue); 
    } else {
      setValueForProperty(domElement, propKey, propValue);
    }
  }
}

// 比较新旧属性的差异
export function diffProperties(domElement, tag, lastRawProps, nextRawProps) {

  debugger

  let updatePayload = null;
  // updatePayload = [key1, value1, key2, value2]
 
  let propKey;

  let lastProps = lastRawProps || {};
  let nextProps = nextRawProps || {};

  // 循环老属性中的key
  for (propKey in lastProps) {
    if (lastProps.hasOwnProperty(propKey) && !nextProps.hasOwnProperty(propKey)) {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }

  // 循环新属性中的key
  for (propKey in nextProps) {
    // 新的值
    const nextProp = nextProps[propKey];

    if (propKey === STYLE) {

    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {

    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        if (nextProp !== lastProps[propKey]) {
          // 如果不同则添加到更细数组中
          (updatePayload = updatePayload || []).push(propKey, nextProp);
        }
      }

    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {
      // Noop

    } else {
      // 除了 style children 之外的 其他属性 
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  return updatePayload;
}


