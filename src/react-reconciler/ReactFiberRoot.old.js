import { createHostRootFiber } from "./ReactFiber.old";
import { initializeUpdateQueue } from "./ReactUpdateQueue.old";

function FiberRootNode(containerInfo) {

  this.containerInfo = containerInfo;

  // 指向current tree
  this.current = null;

  // 指向workInProgress tree
  this.finishedWork = null;
}

export function createFiberRoot(containerInfo) {
  // let root = {
  //   container: containerInfo,
  //   // 指向current tree
  //   current: null,
  //   // 指向workInProgress tree
  //   finishedWork: null,
  // };

  const root = new FiberRootNode(containerInfo);

  // 第一次没有current tree，所以创建一个未初始化的fiber的代替current tree
  let uninitializedFiber = createHostRootFiber();
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化更新队列
  initializeUpdateQueue(uninitializedFiber);

  return root;
}