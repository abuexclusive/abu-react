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
import { Placement } from './ReactFiberFlags';


// function reconcileSingleTextNode(returnFiber, textContent) {
//   const fiber = createFiberFromText(textContent);
//   fiber.return = returnFiber;
//   return fiber;
// }

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


  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    // element type：ƒ App() ｜ div
    // 不管是函数组件还是类组件 babel编译 react element的type都是ƒ () 

    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }


  // 放置单节点 打标记
  function placeSingChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 给新fiber添加副作用，表示在未来提交阶段的DOM操作中会向真实DOM树中添加此节点
      newFiber.flags = Placement;
    }
    return newFiber;
  }

  // returnFiber 父fiber节点
  // currentFirstChild 老fiber子节点
  // newChild react element
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {

    // console.log('returnFiber: ', returnFiber)
    // console.log('currentFirstChild: ', currentFirstChild)
    // console.log('newChild: ', newChild)

    // newChild可能为{}，[]
    const isObject = typeof newChild === 'object' && newChild && newChild.$$typeof;
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
      // return reconcileSingleElement(returnFiber, newChild);
    }

    const isArray = Array.isArray(newChild);

    if (isArray) {
      // return reconcileChildrenArray(returnFiber, newChild);
    }

    const isText = typeof newChild === 'string' || typeof newChild === 'number';

    if (isText) {

    }
    
  }
  return reconcileChildFibers;
}


// 有老fiber是true 没有时为false
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
