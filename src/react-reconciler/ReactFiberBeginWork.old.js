import {
  HostRoot,
  HostComponent,
  HostText,
  ClassComponent,
} from './ReactWorkTags';
import { Placement } from './ReactFiberFlags';
import {
  mountChildFibers,
  reconcileChildFibers
} from './ReactChildFiber.old';


function updateHostRoot(current, workInProgress) {

  const updateQueue = workInProgress.updateQueue;

  const nextChildren = updateQueue.shared.pending.payload.element;

  // react element的props(除了key, ref之外的属性和children)属性，会转化成fiber的pendingProps

  // 传入一个fiber和react element，根据 react element生成workInProgress的child
  reconcileChildren(current, workInProgress, nextChildren);


  // 返回的是大儿子
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
  const fiber = reconcileChildren(workInProgress, nextChildren);
  workInProgress.child = fiber;

  return fiber;
}



/**
 * 处理子节点 根据老fiber和新的虚拟DOM进行比对，创建新的fiber
 * 传入一个fiber 和 react元素，根据react元素生成fiber的child
 */
export function reconcileChildren(current, workInProgress, nextChildren) {
  // console.log('current: ', current)
  // console.log('workInProgress: ', workInProgress)

  if (current === null) {
    // 挂载 不需要比较 全是新的
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
    );
  } else {
    // 如果有current，说明这是一类似于更新的操作
    // 进行比较 新老内容 得到差异进行更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
    );
  }
  console.log('workInProgress: ', workInProgress);
}








/**
 * 负责根据当前fiber 专门只创建子fiber的
 * current 老fiber 
 * workInProgress 新fiber 当前正在构建的节点
 * return 一个workInProgress fiber的 child fiber
 */
function beginWork(current, workInProgress) {
  // 这个地方传进来的workInProgress 就是每个创建好的fiber 根据fiber创建子fiber
  // 第一次为rootfiber 
  // 每次传进来的fiber tag都不一样，tag不一样 创建的流程也不一样 当前先处理 tag = HostRoot | HostComponent
  // 🔥🔥🔥🔥未处理 tag = FunctionComponent | ClassComponent

  // console.log('current: ', current)
  // console.log('workInProgress: ', workInProgress)

  switch(workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    case ClassComponent:
      return null;
    default:
      break;
  }
}

export { beginWork };