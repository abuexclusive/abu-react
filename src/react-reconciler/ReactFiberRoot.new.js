import { createHostRootFiber } from "./ReactFiber.new";

export function createFiberRoot(container) {
  let root = {
    container: container,
    // 指向current tree
    current: null,
    // 指向workInProgress tree
    finishedWork: null,
  };

  // 第一次没有current tree，所以创建一个未初始化的fiber的代替current tree
  let uninitializedFiber = createHostRootFiber();
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  return root;
}