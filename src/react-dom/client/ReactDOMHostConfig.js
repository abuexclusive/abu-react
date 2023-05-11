import { 
  createElement,
  setInitialProperties,
} from "./ReactDOMComponent";

export function shouldSetTextContent(props) {
  return typeof props === 'string' || typeof props === 'number';
}

// 创建真实DOM
export function createInstance(type, props) {
  const domElement = createElement(type, props);
  return domElement;
}


// 为真实DOM添加属性
export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}