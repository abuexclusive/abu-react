import {
  ELEMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE
} from '../../shared/HTMLNodeType';
import { createFiberRoot, createWorkInProgress } from '../../react-reconciler';


function ReactDOMRoot(container) {
  this._internalRoot = createFiberRoot(container);
}


ReactDOMRoot.prototype.render = function(element, container) {

  // 不管是初次渲染还是setState，每次更新总是从Root开始往下遍历
  const root = this._internalRoot;
  console.log('root===', root);

  // 创建workInProgress tree的fiberRoot
  const workInProgress = createWorkInProgress(root.current, null);

  // 用于创建其他元素的fiber节点
  workInProgress.memoizedState = { element: element };

  console.log('current===', root.current)
  console.log('workInProgress===', workInProgress)

}



export function createRoot(container) {
  if (!isValidContainer(container)) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }
  return new ReactDOMRoot(container);
}

export function isValidContainer(node): boolean {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        (node: any).nodeValue === ' react-mount-point-unstable '))
  );
}