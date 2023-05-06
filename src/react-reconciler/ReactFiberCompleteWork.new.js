
import { HostComponent, HostText } from './ReactWorkTags';

/**
 * 1、创建真实的DOM
 * 2、对子节点进行插入
 * 3、给DOM赋值属性
 * @param {*} workInProgress 
 */
function completeWork(workInProgress) {
  console.log('completeWork====', workInProgress)


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
      const instance = createInstance(workInProgress);
      workInProgress.stateNode = instance;
      return null;
    }
    case HostText: {
      const instance = createTextInstance(workInProgress);
      workInProgress.stateNode = instance;
      return null;
    }
    default:
      return null;
  }
  // if (tag === HostComponent) {
    // if (!instance) {
    //   const dom = document.createElement(workInProgress.type);
    //   workInProgress.stateNode = dom;
    //   dom.__reactInternalInstance = workInProgress;

    //   const node = workInProgress.child;
    //   while(!!node) {
    //     let tag = node.tag;
    //     if (tag === HostComponent || tag === HostText) {
    //       dom.appendChild(node.stateNode || document.createTextNode('ceshi'));
    //     }
    //     break;
    //   }
    // }
  // }
}

function createInstance(workInProgress) {
  const instance = document.createElement(workInProgress.type);
  return instance;
}

function createTextInstance(workInProgress) {
  const text = workInProgress.pendingProps;
  const instance = document.createTextNode(text);
  return instance;
}

function appendAllChildren() {
  
}

export { completeWork };