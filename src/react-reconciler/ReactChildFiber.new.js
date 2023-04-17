import {
  REACT_ELEMENT_TYPE
} from '../shared/ReactSymbols';
import {
  HostComponent
} from './ReactWorkTags';
import {
  createFiber,
  createFiberFromText,
} from './ReactFiber.new';


function reconcileSingleElement(returnFiber, element) {
  // element type：ƒ App() ｜ div

  // console.log('returnFiber===', returnFiber)
  // console.log('element===', element)
  const key = element.type;
  if (element.$$typeof === REACT_ELEMENT_TYPE) {
    // 首先是一个react element
    let flag = null;
    if (typeof key === 'object') {
      // 不管是函数组件还是类组件 babel编译 react element的type都是ƒ () 
    }
    if (typeof key === 'string') {
      flag = HostComponent;
    }

    // react元素的props属性转化成fiber的pendingProps
    const fiber = createFiber(flag, element.props, element.key);
    // 新fiber跟父fiber建立联系
    fiber.return = returnFiber;
    fiber.type = element.type;
    return fiber;
  }
}

function reconcileSingleTextNode(returnFiber, textContent) {
  const fiber = createFiberFromText(textContent);
  fiber.return = returnFiber;
  return fiber;
}

function reconcileChildrenArray(returnFiber, newChildren) {
  // newChildren：['text', {…}, {…}, {…}]
  // console.log('newChildren===', newChildren)

  // return的第一个fiber
  let resultingFirstChild = null;
  // 上一个新的fiber
  let previousNewFiber = null;
  for(let newIdx = 0; newIdx < newChildren.length; newIdx++) {
    let newFiber = null;
    const element = newChildren[newIdx];
    if (typeof element === 'string' || typeof element === 'number') {
     
      newFiber = reconcileSingleTextNode(returnFiber, element);

    } else {
      newFiber = reconcileSingleElement(returnFiber, element);
    }
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;

    // if (newIdx === 0) {
    //   if (typeof element === 'string' || typeof element === 'number') {
    //     returnFiber.child = reconcileSingleTextNode(returnFiber, newChildren[newIdx]);
    //   } else {
    //     returnFiber.child = reconcileSingleElement(returnFiber, newChildren[newIdx]);
    //   }
    //   previousNewFiber = returnFiber.child;
    // } else {
    //   if (typeof element === 'string' || typeof element === 'number') {
    //     previousNewFiber.sibling = reconcileSingleTextNode(returnFiber, newChildren[newIdx]);
    //   } else {
    //     previousNewFiber.sibling = reconcileSingleElement(returnFiber, newChildren[newIdx]);
    //   }
    //   previousNewFiber = previousNewFiber.sibling;
    // }
  }

  return resultingFirstChild;
}


/**
 * 根据react元素 返回第一个子元素，这里需要判断传入的react元素是{},还是数组
 * @param {*} returnFiber 
 * @param {*} newChild 
 * @returns 
 */
function reconcileChildFibers(returnFiber, newChild) {
  // newChild: react element
  // console.log('returnFiber===', returnFiber)
  // console.log('newChild===', newChild)


  // newChild可能为{}，[]
  const isObject = typeof newChild === 'object' && newChild && newChild.$$typeof;
  
  if (isObject) {
    // switch (newChild.$$typeof) {
    //   // newChild.$$typeof 说明只有一个元素 独生子
    //   case REACT_ELEMENT_TYPE:
    //     return reconcileSingleElement(returnFiber, newChild);
    //     default:
    //       break;
    // }
    return reconcileSingleElement(returnFiber, newChild);
  }

  const isArray = Array.isArray(newChild);

  if (isArray) {
    return reconcileChildrenArray(returnFiber, newChild);
  }

  const isText = typeof newChild === 'string' || typeof newChild === 'number';

  if (isText) {
    // 这种情况的用例？？？？
  }

  return null;

}


export {
  reconcileChildFibers
};