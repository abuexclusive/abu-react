
import { HostComponent, HostText } from './ReactWorkTags';
import { 
  createInstance,
  finalizeInitialChildren,
  prepareUpdate,
} from '../react-dom/client/ReactDOMHostConfig';
import { Update } from './ReactFiberFlags';



// 将fiber标记为 更新
function markUpdate(workInProgress) {

  // 如果原来是 0 变成 4 更新
  // 如果原来是 2 变成 6 移动
  // flags 可能是累加的，有的节点及可能是新节点 又可能移动
  workInProgress.flags |= Update;
}

// 更新 workInProgress 的 stateNode
function updateHostComponent(current, workInProgress, type, newProps) {

  // 得到老的属性
  const oldProps = current.memoizedProps;

  if (oldProps === newProps) {
    return;
  }

  // 真实的DOM节点
  const instance = workInProgress.stateNode;

  // 收集更新
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);

  // 把更新放在 fiber 的updateQueue上 做后续更新处理
  // 🔥🔥🔥 
  // rootFiber 上的 updateQueue 是一个环状链表 update = { payload: element }
  // 原生组件fiber (HostComponent) updateQueue 就是 updatePayload 新旧DOM属性对比后的差异

  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
  }
}


/**    
 * 1、创建真实的DOM
 * 2、对子节点进行插入
 * 3、给DOM赋值属性
 * @param {*} workInProgress 
 */
function completeWork(current, workInProgress) {
  // console.log('completeWork workInProgress: ', workInProgress);

  const newProps = workInProgress.pendingProps;
    // 1、创建真实的DOM
    // 1.1、<h1>对应的fiber，这时<h1>对应的fiber有兄弟节点<h2>，该兄弟节点已经在beginWork中创建完成，返回<h2>对应的fiber，作为下一个工作单元
    // 1.2、文本'123'对应的fiber，有兄弟节点<p>，返回<p>对应的fiber，作为下一个工作单元
    // 1.3、<p>对应的fiber，没有兄弟节点，使用父节点<h2>作为当前工作单元继续循环
    // 1.4、<h2>对应的fiber，有兄弟节点<h3>，返回<h3>对应的fiber，作为下一个工作单元
    // 1.5、<span>对应的fiber，没有兄弟节点，使用父节点<h3>作为当前工作单元继续循环
    // 1.6、<h3>对应的fiber，没有兄弟节点，使用父节点<div>作为当前工作单元继续循环
    // 1.7、<div>对应的fiber，没有兄弟节点，使用root作为当前工作单元继续循环
    // 1.8、rootfiber没有兄弟节点也没有父节点 结束循环
  switch (workInProgress.tag) {
    case HostComponent: {
      const type = workInProgress.type;

      if (current !== null && workInProgress.stateNode !== null) {
        // 说明 workInProgress 复用了 current，更新DOM属性
        updateHostComponent(current, workInProgress, type, newProps);
      } else {
        // 创建真实DOM
        const instance = createInstance(type, newProps);
        workInProgress.stateNode = instance;
        // 给真实DOM添加属性
        finalizeInitialChildren(instance, type, newProps);
      }
      return null;
    }
    case HostText: {
      // const instance = createTextInstance(workInProgress);
      // workInProgress.stateNode = instance;
      return null;
    }
    default:
      return null;
  }
}


export { completeWork };