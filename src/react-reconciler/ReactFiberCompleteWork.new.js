
import { HostComponent, HostText } from './ReactWorkTags';

/**
 * 1、创建真实的DOM
 * 2、对子节点进行插入
 * 3、给DOM赋值属性
 * @param {*} workInProgress 
 */
function completeWork(workInProgress) {
  // console.log('completeWork====', workInProgress)

  // 1、创建真实的DOM
  const tag = workInProgress.tag;
  const instance = workInProgress.stateNode;
  // if (tag === HostComponent) {
  //   if (!instance) {
  //     const dom = document.createElement(workInProgress.type);
  //     workInProgress.stateNode = dom;
  //     dom.__reactInternalInstance = workInProgress;

  //     const node = workInProgress.child;
  //     while(!!node) {
  //       let tag = node.tag;
  //       if (tag === HostComponent || tag === HostText) {
  //         dom.appendChild(node.stateNode || document.createTextNode('ceshi'));
  //       }
  //       break;
  //     }
  //   }
  // }
}

export { completeWork };