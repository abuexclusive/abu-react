import { 
  createElement,
  diffProperties,
  setInitialProperties,
  updateProperties,
} from "./ReactDOMComponent";

export function shouldSetTextContent(props) {
  return typeof props === 'string' || typeof props === 'number';
}

// 创建真实DOM
export function createInstance(type, props) {
  const domElement = createElement(type, props);
  return domElement;
}


// 真实DOM 添加属性
export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

// 真实DOM 添加子节点
export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

// 真实DOM 删除子节点
export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}


// 真实DOM 更新节点
export function commitUpdate(domElement, updatePayload) {
  updateProperties(domElement, updatePayload);
}


// 根据oldProps, newProps 获取属性差异
export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}

