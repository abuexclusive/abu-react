/* eslint-disable default-case */
import { appendChild, commitUpdate, removeChild } from "../react-dom/client/ReactDOMHostConfig";
import { HostComponent, HostRoot } from "./ReactWorkTags";

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

function isHostParent(fiber) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot
  );
}


/**
 * 根据副作用插入节点
 * finishedWork 
 */
function commitPlacement(finishedWork) {

  // 获取父fiber
  const parentFiber = getHostParentFiber(finishedWork);

  // 父fiber对应的真实DOM 
  const parentStateNode = parentFiber.stateNode;

  // 获取当前fiber对应的真实DOM
  const stateNode = finishedWork.stateNode;

  let parent;
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      break;
    case HostRoot:
      parent = parentStateNode.containerInfo;
      break;
    default:
      parent = parentStateNode;
      break;
  }
  appendChild(parent, stateNode);
}


/**
 * 根据副作用更新节点
 * current 
 * finishedWork
 */
function commitWork(current, finishedWork) {

  switch (finishedWork.tag) {
    case HostComponent: {
      const instance = finishedWork.stateNode;
      if (instance !== null) {
        const updatePayload = finishedWork.updateQueue;
        finishedWork.updateQueue = null;
        if (updatePayload !== null) {
          commitUpdate(instance, updatePayload);
        }
      }
      return;
    }
  }

}


/**
 * 根据副作用删除节点
 * current 
 */
function commitDeletion(current) {
  if (!current) return;
  const parentFiber = getHostParentFiber(current);
  const parentStateNode = parentFiber.stateNode;
  const stateNode = current.stateNode;

  let parent;
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      break;
    case HostRoot:
      parent = parentStateNode.containerInfo;
      break;
    default:
      parent = parentStateNode;
      break;
  }
  removeChild(parent, stateNode);

}

export {
  commitPlacement,
  commitWork,
  commitDeletion,
}