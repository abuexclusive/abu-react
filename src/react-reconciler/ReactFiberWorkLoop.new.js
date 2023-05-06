import { beginWork } from "./ReactFiberBeginWork.new";
import { completeWork } from "./ReactFiberCompleteWork.new";

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
function workLoopConcurrent(nextUnitOfWork) {

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

    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // break;
  }
}

function performUnitOfWork(unitOfWork) {
  let next = beginWork(unitOfWork);

  if (next === null) {

    next = completeUnitOfWork(unitOfWork);
  }

  return next;
}

function completeUnitOfWork(unitOfWork) {
  // debugger
  while(unitOfWork) {
    
    let returnFiber = unitOfWork.return;
    let siblingFiber = unitOfWork.sibling;


    // 进入到这里 说明该unitOfWork有且仅有一个文本节点
    // 1、创建真实的DOM
      // 1.1、<h1>对应的fiber，这时<h1>对应的fiber有兄弟节点<h2>，该兄弟节点已经在beginWork中创建完成，返回<h2>对应的fiber，作为下一个工作单元
      // 1.2、文本'123'对应的fiber，有兄弟节点<p>，返回<p>对应的fiber，作为下一个工作单元
      // 1.3、<p>对应的fiber，没有兄弟节点，使用父节点<h2>作为当前工作单元继续循环
      // 1.4、<h2>对应的fiber，有兄弟节点<h3>，返回<h3>对应的fiber，作为下一个工作单元
      // 1.5、<span>对应的fiber，没有兄弟节点，使用父节点<h3>作为当前工作单元继续循环
      // 1.6、<h3>对应的fiber，没有兄弟节点，使用父节点<div>作为当前工作单元继续循环
      // 1.7、<div>对应的fiber，没有兄弟节点，使用root作为当前工作单元继续循环
      // 1.8、rootfiber没有兄弟节点也没有父节点 结束循环

    // 2、对子节点进行插入
    // 3、给DOM赋值属性
    completeWork(unitOfWork);

    // 如果有兄弟节点
    if (!!siblingFiber) return siblingFiber;

    // 这种情况下没有兄弟节点了，如果有父节点
    if (!!returnFiber) {

      // return returnFiber;
      // 不能直接return 父fiber, 比如456对应的fiber，父fiber是<p>对应的fiber，此时<p>对应的已经是fiber，将继续创建456fiber，进入死循环

      unitOfWork = returnFiber;
      // 将当前fiber从456 变成<p>对应的fiber，重新开始找<p>对应的fiber的兄弟节点和父节点
      // 这里workInProgress最终会回到rootfiber,而rootfiber没有return和sibling

      // ⚠️⚠️⚠️ 这里的continue并不是返回 当前传入的fiber没有兄弟节点的时候 就会把父节点作为当前节点 继续查找兄弟节点
      continue;
    }
    return null;
  }

}

export {
  workLoopConcurrent
};