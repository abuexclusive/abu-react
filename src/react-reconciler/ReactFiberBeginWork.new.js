import {
  HostRoot,
  HostComponent,
  HostText,
  ClassComponent,
} from './ReactWorkTags';
import { Placement } from './ReactFiberFlags';
import {
  reconcileChildFibers
} from './ReactChildFiber.new';


/**
 * 传入一个fiber 和 react元素，根据react元素生成fiber的child
 * @param {*} workInProgress 
 * @param {*} nextChildren 
 */
function reconcileChildren(workInProgress, nextChildren) {
  if (!!workInProgress.alternate) {
    // workInProgress.child 就是<App />对应的fiber
    workInProgress.child = reconcileChildFibers(workInProgress, nextChildren);
    workInProgress.child.flags = Placement;
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, nextChildren);
  }
}


function updateHostRoot(workInProgress) {
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  // react element的props(除了key, ref之外的属性和children)属性，会转化成fiber的pendingProps
  // console.log('workInProgress===', workInProgress)
  // console.log('nextChildren===', nextChildren)

  // 传入一个fiber和react element，根据 react element生成workInProgress的child
  reconcileChildren(workInProgress, nextChildren);

  return workInProgress.child;
}


function updateHostComponent(workInProgress) {
  // debugger
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;

  // 用例1：<div><h1></h1><h2></h2><h3></h3></div> 此时fiber的nextProps对应的children是个数组
  // 用例2：<div>abc</div> 此时fiber的nextProps对应的children是个string | number


  // 如果nextChildren是一个string｜number 证明该fiber有且仅有一个孤立的文本节点，这个文本节点不创建fiber
  if (typeof nextChildren === 'string' || typeof nextChildren === 'number') {
    nextChildren = null;
    // nextChildren 传入以下reconcileChildren函数最终返回null
  }

  // 传入一个fiber和react element，根据 react element生成workInProgress的child
  reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}


/**
 * 负责根据当前fiber 专门只创建子fiber的
 * @param {*} workInProgress 当前fiber
 */
function beginWork(workInProgress) {
  // debugger
  // 这个地方传进来的workInProgress 就是每个创建好的fiber 根据fiber创建子fiber
  // 第一次为rootfiber 
  // 每次传进来的fiber tag都不一样 
  // console.log('workInProgress===', workInProgress)

  switch(workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress);
    case HostComponent:
      return updateHostComponent(workInProgress);
    case HostText:
      return null;
    case ClassComponent:
      return null;
    default:
      break;
  }
}

export { beginWork };