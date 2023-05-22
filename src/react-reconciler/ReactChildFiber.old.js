import {
  REACT_ELEMENT_TYPE
} from '../shared/ReactSymbols';
import {
  HostComponent
} from './ReactWorkTags';
import {
  createFiberFromText,
  createFiberFromElement,
} from './ReactFiber.old';
import { Deletion, Placement } from './ReactFiberFlags';
import { createWorkInProgress } from './ReactFiber.old';



function ChildReconciler(shouldTrackSideEffects) {

  // 复用fiber
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.sibling = null;
    return clone;
  }


  // 创建fiber
  function createChild(returnFiber, newChild) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      const created = createFiberFromText(newChild);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      const created = createFiberFromElement(newChild);
      created.return = returnFiber;
      return created;
    }

  }


  // 试图复用老fiber
  function updateSlot(returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;

    if (newChild.key === key) {
      return updateElement(returnFiber, oldFiber, newChild);
    } else {
      return null;
    }
  }


  // 根据element复用fiber
  function updateElement(returnFiber, current, element) {
    if (current !== null) {
      if (current.type === element.type) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const existing = useFiber(current, element.props);
        existing.return = returnFiber;
        return existing;
      }
      // 如果type不同 直接创建新的返回 
    }

    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }


  // 从map中查找是否有复用的fiber
  function updateFromMap(
    existingChildren,
    returnFiber,
    newIdx,
    newChild
  ) {
    // 使用新的element 的key 或者index查找
    const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
    // 判断类型是否一样 一样复用 不一样创建新的返回，当matchedFiber===null时，同样是创建新的返回
    return updateElement(returnFiber, matchedFiber, newChild);
  }


  // 放置newFiber，记录位置 标记副作用
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    // 给fiber添加索引
    // react中以新的element为准，在新的element右边的oldFiber不需要移动，在oldFiber左侧的需要移动
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      return lastPlacedIndex;
    }

    const current = newFiber.alternate;
    if (current !== null) {
      // 复用了
      const oldIndex = current.index;
      // 以新的位置为准,如果
      if (oldIndex < lastPlacedIndex) {
        // 复用的节点在左侧 需要移动
        newFiber.flags = Placement;
        // 不更新lastPlacedIndex
        return lastPlacedIndex;
      } else {
        // 不需要移动
        lastPlacedIndex = oldIndex;
        return lastPlacedIndex;
      }
    } else {
      // 没有复用
      newFiber.flags = Placement;
      return lastPlacedIndex;
    }

  }


  // 标记 删除fiber
  // returnFiber 新的父节点
  // childToDelete 需要标记删除的旧节点
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
    // 需要跟踪副作用 并且当前fiber没有副本 说明就是新创建的 
    // mount 不需要跟踪副作用
    // 当挂载一个新的节点的时候 并没有跟踪副作用 而是在completeWork 时将fiber对应的子DOM创建并追加给父fiber的stateNode
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 给新fiber添加副作用，表示在未来提交阶段的DOM操作中会向真实DOM树中添加此节点
      // Placement 添加 创建 或者挂载
      newFiber.flags = Placement;
    }
    return newFiber;
  }


  // 将剩余的fiber归纳到map中
  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild); 
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }

    return existingChildren;
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



  /**
   * * 调度多节点 
   * 1、根据多个 element 创建 fiber，此时是数组，同级的 fiber 需要循环创建完成
   * 2、多节点更新逻辑 diif
   * 
   * returnFiber 新的父fiber节点
   * currentFirstChild 老fiber子节点
   * newChildren  
   */
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {

    // 返回的第一个大儿子
    let resultingFirstChild = null;
    let previousNewFiber = null;

    // 当前老fiber
    let oldFiber = currentFirstChild;
    let newIdx = 0;
    // 上一个可以复用的 不需要移动的老节点的索引 
    let lastPlacedIndex = 0;
    // 下一个老fiber
    let nextOldFiber = null;


    // 当前老fiber存在 element存在 处理更新
    // 测试用例    老                       ｜        新
    // <ul>                                |  <ul>
    //   <li key='A'>A</li>                |    <li key='A'>A</li>   
    //   <li key='B' id='B'>B</li>         |    <p key='B'>B</p> 
    //   <li key='C' id='C1'>C</li>        |    <li key='C' id='C2'>C2</li> 
    // </ul>                               |
    // effect: （删除#li#B）=>（插入#P#B）=>（更新#li#C）=> null

    // 阶段 1：同时从左往右遍历，旧 fiber 和 element 各自的指针一起从左往右走。指针分别为 nextOldFiber 和 newIdx，从左往右不断遍历
    for(; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // 先缓存下一个老fiber 老fiber树 和 newChildren指针同时向下移动
      nextOldFiber = oldFiber.sibling;

      // 试图复用老fiber 
      // 1、如果key不一样 newFiber === null
      // 2、如果key一样，type不一样 创建新的fiber
      // 3、如果key一样，type一样，复用老fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);

      if (newFiber === null) {
        // 如果key不一样则直接跳出循环
        break;
      }

      if (oldFiber && newFiber.alternate === null) {
        // 说明并没有复用，需要删除oldFiber
        deleteChild(returnFiber, oldFiber);
      }

      // 记录新fiber位置
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      // 如果有newFiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;

      // 指针向后移动
      oldFiber = nextOldFiber;
    }


    // 新的element已经遍历完成，需要删除剩下的老fiber
    // 测试用例    老                       ｜        新
    // <ul>                                |  <ul>
    //   <li key='A'>A</li>                |    <li key='A'>A</li>   
    //   <li key='B' id='B'>B</li>         |    <li key='B' id='B2'>B2</li> 
    //   <li key='C'>C</li>                |  <ul>
    // </ul>                               |
    // effect:（删除#li#C）=> （更新#li#B）=> null

    // 阶段 2：新节点遍历完的情况，跳出循环后，我们先看 新节点数组是否遍历完（newIdx === newChildren.length）是的话，就将旧节点中剩余的所有节点编辑为 “删除”，然后直接结束整个函数。
    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    // 老的fiber没有了 接着遍历创建新的fiber
    // 阶段 3：旧节点遍历完，新节点没遍历完的情况，如果是旧节点遍历完了，但新节点没有遍历完，就将新节点中的剩余节点，根据 element 构建为 fiber。
    if (oldFiber === null) {
      // 说明没有老节点 是新创建的
      for(; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        // newFiber.flags = Placement;
        // 给fiber 添加索引
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {

          resultingFirstChild = newFiber;

        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }

    // 当对比的oldFiber 和 element key不同 跳出第一轮循环之后执行
    // 阶段 4：使用 map 高效匹配新旧节点进行更新
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    for (; newIdx < newChildren.length; newIdx++) {

      // 从map中找 是否有能被复用的fiber
      const newFiber = updateFromMap(
        existingChildren, 
        returnFiber, 
        newIdx, 
        newChildren[newIdx],
      );

      if (newFiber !== null) {
        // 1、复用了老fiber  2、创建的新fiber
        if (newFiber.alternate !== null) {
          // 说明是复用的，需要从map中删除老fiber
          existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;

      }
    }
    

    // 如果新的newChildren遍历完成 map中还有剩余的老fiber 这时需要标记删除
    existingChildren.forEach(child => deleteChild(returnFiber, child));

    return resultingFirstChild;
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



















/**
 * 旧  abcd
 * 新  acbd
 * 
 * 
 */