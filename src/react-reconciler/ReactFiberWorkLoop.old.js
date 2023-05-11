import { createWorkInProgress } from "./ReactFiber.old";
import { beginWork } from "./ReactFiberBeginWork.old";
import { completeWork } from "./ReactFiberCompleteWork.new";
import { HostRoot } from "./ReactWorkTags";


// 更新分为两步
// 1、render 根据老的fiber树 和 新的虚拟DOM构建新的fiber树并找出差异，也就是diff的结果，可以中断
// 2、commit 根据diff结果更新真是DOM，更新完成之后新的fiber树，就成为fiberRoot的current，不可以中断
let workInProgressRoot = null;
let workInProgress = null;


/**
 * 不管如何更新，哪个fiber更新，都会调度到这个方法里
 */
export function scheduleUpdateOnFiber(fiber) {
  // console.log('fiber: ', fiber);

  // 这里是根据当前的fiber追溯到fiberRoot，因为不管是哪个fiber更新 都需要从rootFiber开始
  // 当前fiber所在的fiber树 找到rootFiber 其实就是hostRootFiber，在hostRootFiber上调度更新
  const root = markUpdateLaneFromFiberToRoot(fiber);

  performSyncWorkOnRoot(root);

}


/**
 * 向上找到根节点
 */
function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = sourceFiber.return;

  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }

  if (node.tag === HostRoot) {
    // root fiberRoot
    const root = node.stateNode;
    return root;
  } else {
    return null;
  }

}

/**
 * 开始在根节点上执行工作循环
 */
function performSyncWorkOnRoot(root) {
  
  // root === fiberRoot
  workInProgressRoot = root;
  const current = root.current;
  workInProgress = createWorkInProgress(current, null);


  /**
   * 
   *                                           ---------------------------
   *                                           |     FiberRootNode       |
   *                                           | containerInfo(div#root) |
   *                                           ---------------------------
   *                                              ^            |
   *                                              |            |current
   *                                              |stateNode   |
   *                                              |            V
   *                                      ------------------------      alternate      ------------------------
   *                                      |     hostRootFiber    |     ---------->     |    workInprogress    |
   *                                      | updateQueue(element) |     <----------     | updateQueue(element) |
   *                                      ------------------------      alternate      ------------------------
   */


  // 1、根据虚拟DOM react element创建新的fiber tree
  // 2、把新的fiber tree的内容同步到真实DOM中
  workLoopSync();

}

/**
 * 工作循环 同步
 */
function workLoopSync() {
  let index = 1;
  while (workInProgress !== null) {
    console.log('workInProgress: ', index, workInProgress);
    performUnitOfWork(workInProgress);
    if (index === 2) break;
    index++;
  }
}


function performUnitOfWork(unitOfWork) {

  // 当前fiber的替身
  const current = unitOfWork.alternate;

  let next = beginWork(current, unitOfWork);


  if (next === null) {
    
    completeUnitOfWork(unitOfWork);

  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;

  do {

    const current = completeWork.alternate;
    const returnFiber = completedWork.return;

    // 完成此fiber对应真实DOM的创建 和 属性赋值的功能
    completeWork(current, completedWork);

    console.log(111, completedWork, returnFiber)

    // 收集副作用 
    break;

  } while (completedWork !== null)






  // while(unitOfWork) {
    
  //   let returnFiber = unitOfWork.return;
  //   let siblingFiber = unitOfWork.sibling;


  //   // 进入到这里 说明该unitOfWork有且仅有一个文本节点
  //   // 1、创建真实的DOM
  //     // 1.1、<h1>对应的fiber，这时<h1>对应的fiber有兄弟节点<h2>，该兄弟节点已经在beginWork中创建完成，返回<h2>对应的fiber，作为下一个工作单元
  //     // 1.2、文本'123'对应的fiber，有兄弟节点<p>，返回<p>对应的fiber，作为下一个工作单元
  //     // 1.3、<p>对应的fiber，没有兄弟节点，使用父节点<h2>作为当前工作单元继续循环
  //     // 1.4、<h2>对应的fiber，有兄弟节点<h3>，返回<h3>对应的fiber，作为下一个工作单元
  //     // 1.5、<span>对应的fiber，没有兄弟节点，使用父节点<h3>作为当前工作单元继续循环
  //     // 1.6、<h3>对应的fiber，没有兄弟节点，使用父节点<div>作为当前工作单元继续循环
  //     // 1.7、<div>对应的fiber，没有兄弟节点，使用root作为当前工作单元继续循环
  //     // 1.8、rootfiber没有兄弟节点也没有父节点 结束循环

  //   // 2、对子节点进行插入
  //   // 3、给DOM赋值属性
  //   completeWork(unitOfWork);

  //   // 如果有兄弟节点
  //   if (!!siblingFiber) return siblingFiber;

  //   // 这种情况下没有兄弟节点了，如果有父节点
  //   if (!!returnFiber) {

  //     // return returnFiber;
  //     // 不能直接return 父fiber, 比如456对应的fiber，父fiber是<p>对应的fiber，此时<p>对应的已经是fiber，将继续创建456fiber，进入死循环

  //     unitOfWork = returnFiber;
  //     // 将当前fiber从456 变成<p>对应的fiber，重新开始找<p>对应的fiber的兄弟节点和父节点
  //     // 这里workInProgress最终会回到rootfiber,而rootfiber没有return和sibling

  //     // 🔥🔥🔥🔥 这里的continue并不是返回 当前传入的fiber没有兄弟节点的时候 就会把父节点作为当前节点 继续查找兄弟节点
  //     continue;
  //   }
  //   return null;
  // }

}

