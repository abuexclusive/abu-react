import {
  REACT_ELEMENT_TYPE
} from '../shared/ReactSymbols';
import {
  HostComponent
} from './ReactWorkTags';
import {
  createFiber,
  createFiberFromText,
  createFiberFromElement,
} from './ReactFiber.old';
import { Deletion, Placement } from './ReactFiberFlags';
import { createWorkInProgress } from './ReactFiber.old';


// function reconcileChildrenArray(returnFiber, newChildren) {
//   // newChildren：['text', {…}, {…}, {…}]
//   // console.log('newChildren===', newChildren)

//   // return的第一个fiber
//   let resultingFirstChild = null;
//   // 上一个新的fiber
//   let previousNewFiber = null;
//   for(let newIdx = 0; newIdx < newChildren.length; newIdx++) {
//     let newFiber = null;
//     const element = newChildren[newIdx];
//     if (typeof element === 'string' || typeof element === 'number') {
     
//       newFiber = reconcileSingleTextNode(returnFiber, element);

//     } else {
//       newFiber = reconcileSingleElement(returnFiber, element);
//     }
//     if (previousNewFiber === null) {
//       resultingFirstChild = newFiber;
//     } else {
//       previousNewFiber.sibling = newFiber;
//     }
//     previousNewFiber = newFiber;

//     // if (newIdx === 0) {
//     //   if (typeof element === 'string' || typeof element === 'number') {
//     //     returnFiber.child = reconcileSingleTextNode(returnFiber, newChildren[newIdx]);
//     //   } else {
//     //     returnFiber.child = reconcileSingleElement(returnFiber, newChildren[newIdx]);
//     //   }
//     //   previousNewFiber = returnFiber.child;
//     // } else {
//     //   if (typeof element === 'string' || typeof element === 'number') {
//     //     previousNewFiber.sibling = reconcileSingleTextNode(returnFiber, newChildren[newIdx]);
//     //   } else {
//     //     previousNewFiber.sibling = reconcileSingleElement(returnFiber, newChildren[newIdx]);
//     //   }
//     //   previousNewFiber = previousNewFiber.sibling;
//     // }
//   }

//   return resultingFirstChild;
// }


function ChildReconciler(shouldTrackSideEffects) {

  // 复用fiber
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.sibling = null;
    return clone;
  }

  // 标记 删除fiber
  function deleteChild(returnFiber, childToDelete) {
    // returnFiber 新的父fiber
    // childToDelete 旧的子fiber

    if (!shouldTrackSideEffects) {
      // 如果不需要跟踪副作用
      return;
    }

    // 其实在这个地方 是根据当前页面上渲染的内容也就是老的fiber树 和 当前新的element对比 生成一个新的effectlist

    // 把自己的添加到returnFiber的 effectlist 上
    const last = returnFiber.lastEffect;
    if (last !== null) {
      returnFiber.lastEffect.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      // returnFiber没有 副作用
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }

    // 清空下一个副作用指向
    childToDelete.nextEffect = null;
    // 
    childToDelete.flags = Deletion;
  }

  // 标记 删除所有的 兄弟fiber
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return;
    }

    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
  }


  // 放置单节点 打标记
  function placeSingChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 给新fiber添加副作用，表示在未来提交阶段的DOM操作中会向真实DOM树中添加此节点
      // Placement 添加 创建 或者挂载
      newFiber.flags = Placement;
    }
    return newFiber;
  }
  
  /**
   * 调度单节点 
   * 1、根据单个 element 创建 fiber
   * 2、单节点更新逻辑 diif，因为新的element是一个单节点
   * 
   * returnFiber 新的父fiber节点
   * currentFirstChild 老fiber子节点
   * element 
   */
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    // element type：ƒ App() ｜ div
    // 不管是函数组件还是类组件 babel编译 react element的type都是ƒ () 

    // console.log(returnFiber, currentFirstChild, element)

    // key相同，type相同 复用老节点，只更新属性
    const key = element.key;
    let child = currentFirstChild;

    while (child !== null) {
      // 这里使用循环的原因是 因为新的虚拟DOM只有一个 但是旧fiber可能有sibling 

      if (child.key === key) {
        // 1、判断 key 是否相同
        if (child.type === element.type) {
          // 2、判断 type 是否相同

          // 删除除了当前fiber以外的所有fiber
          deleteRemainingChildren(returnFiber, child.sibling);

          // 复用
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;

          return existing;

        } 
        // key相同 但是type不同 这时删除包括当前fiber在内的所有老fiber

        deleteRemainingChildren(returnFiber, child);
        break;

      } else {
        // 如果key不相同 说明当前这个老fiber不是对应于新的虚拟DOM 直接标记删除 child
        deleteChild(returnFiber, child);
      }
  
      // 继续匹配sibling
      child = child.sibling;
    }

    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }


  // 根据多个 element 创建 fiber，此时是数组，同级的 fiber 需要循环创建完成
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    console.log('returnFiber: ', returnFiber, newChildren)
  }


  

  // returnFiber 新的父fiber节点
  // currentFirstChild 老fiber子节点
  // newChild react element
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {

    // newChild可能为{}，[]
    const isObject = typeof newChild === 'object' && newChild !== null;
    if (isObject) {
      // 单节点
      switch (newChild.$$typeof) {
        // newChild.$$typeof 说明只有一个元素 独生子
        case REACT_ELEMENT_TYPE:
          return placeSingChild(reconcileSingleElement(
            returnFiber, currentFirstChild, newChild
            ));
          default:
            break;
      }
    }

    const isArray = Array.isArray(newChild);

    if (isArray) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }

    const isText = typeof newChild === 'string' || typeof newChild === 'number';

    if (isText) {

    }

    return null;
    
  }

  return reconcileChildFibers;
}


// 有老fiber是true 没有时为false
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
