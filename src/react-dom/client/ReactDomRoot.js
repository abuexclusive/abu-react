import {
  ELEMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE
} from '../../shared/HTMLNodeType';
import { 
  createWorkInProgress,
  beginWork,
  completeWork,
  workLoopConcurrent,
  createContainer
} from '../../react-reconciler';


let nextUnitOfWork = null;

export function createRoot(container) {
  if (!isValidContainer(container)) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }
  return new ReactDOMRoot(container);
}


function ReactDOMRoot(container) {
  this._internalRoot = createRootImpl(container);
}

function createRootImpl(container) {
  const root = createContainer(container);
  return root; 
}



ReactDOMRoot.prototype.render = function(element, container) {

  // 不管是初次渲染还是setState，每次更新总是从Root开始往下遍历
  const root = this._internalRoot;
  console.log('fiber root：', root);

  // 创建workInProgress tree的fiberRoot
  const workInProgress = createWorkInProgress(root.current, null);

  // 用于创建其他元素的fiber节点
  workInProgress.memoizedState = { element: element };

  // console.log('current===', root.current)
  // console.log('workInProgress===', workInProgress)

  // 根据workInProgress树的rootfiber创建workInProgress树
  nextUnitOfWork = workInProgress;
  workLoopConcurrent(nextUnitOfWork);

  console.log('workInProgress tree：',  workInProgress);

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



/**
 * 建workInProgress树，workInProgress树的每个节点都叫workInProgress
 * @param {*} nextUnitOfWork 下一个工作单元
 * <div id="sky" key="halo">
    <h1>
      first child
    </h1>
    <h2>
      h1 sibling child
      <p>456</p>
    </h2>
    <h3>h2 sibling child</h3>
 * </div>
 * 碰到节点下面是数组的要一次性创建完成 并返回第一个作为父fiber的child
 */
function workLoopConcurrent_1(nextUnitOfWork) {

  while(!!nextUnitOfWork) {
    // debugger
    // 当没有下一个工作单元时说明fiber树已经创建完成
    // 深度优先遍历创建fiber
    // step 1: 当前的下一个工作单元为rootfiber
    // step 2: 创建<div id="sky" key="halo">对应的fiber
    // step 3: 创建<h1> <h2> <h3>对应的fiber 返回第一个fiber作为<div id="sky" key="halo">对应fiber的child
    // step 4: 创建first child对应的fiber，文本节点没有子节点 看有没有兄弟节点，无兄弟节点返回父节点<h1>对应的fiber，查看<h1>对应的fiber的兄弟节点
    // step 5: <h2>对应的fiber 创建'h1 sibling child'对应的fiber和创建<p>节点对应的fiber 
    // step 6: ......
    // 当一个节点没有子节点和兄弟节点的时候 需要回溯到父节点，从workInProgress树的rootfiber出发最终回到workInProgress树的rootfiber

    nextUnitOfWork = performUnitOfWork_1(nextUnitOfWork);
    // break;
  }
}


/**
 * 根据当前的fiber 返回下一个fiber（子fiber、兄弟fiber、父fiber）
 * @param {*} workInProgress 当前的fiber
 */
function performUnitOfWork_1(workInProgress) {
  // 1 rootfiber
  // 2 <div id="sky" key="halo"> fiber
  // 3 <h1> fiber
  // 4 'first child' fiber  

  let next = beginWork(workInProgress);
  // console.log('beginWork next after：',  workInProgress, next);

  
  if (next === null) {

    // 当没有子节点的情况，比如'first child' fiber没有子节点，这时就要通过'first child' fiber找他的兄弟节点
    // workInProgress就是'first child' fiber

    // console.log('completeUnitOfWork====', workInProgress)
    next = completeUnitOfWork_1(workInProgress);

  }

  return next;
}


/**
 * 负责根据当前fiber 专门只创建子fiber的
 * workInProgress 当前fiber
 * 
 * function beginWork(workInProgress) {}
 */



/**
 * 负责根据当前fiber 找兄弟节点 没有兄弟节点 就找父节点
 * @param {*} workInProgress 当前fiber
 */
function completeUnitOfWork_1(workInProgress) {
  // debugger
  // console.log('completeUnitOfWork====', workInProgress)
  while(workInProgress) {
    
    let returnFiber = workInProgress.return;
    let siblingFiber = workInProgress.sibling;


    // 进入到这里 说明该workInProgress有且仅有一个文本节点
    // 1、创建真实DOM
    // 2、对子节点进行插入
    // 3、给DOM赋值属性
    completeWork(workInProgress);

    // 如果有兄弟节点
    if (!!siblingFiber) return siblingFiber;

    // 这种情况下没有兄弟节点了，如果有父节点
    if (!!returnFiber) {

      // return returnFiber;
      // 不能直接return 父fiber, 比如456对应的fiber，父fiber是<p>对应的fiber，此时<p>对应的已经是fiber，将继续创建456fiber，进入死循环

      workInProgress = returnFiber;
      // 将当前fiber从456 变成<p>对应的fiber，重新开始找<p>对应的fiber的兄弟节点和父节点
      // 这里workInProgress最终会回到rootfiber,而rootfiber没有return和sibling
      continue;
    }
    return null;
  }
}


