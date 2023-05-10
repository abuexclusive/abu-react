
import { WorkTag, HostRoot, HostText, HostComponent } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';

/**
 * 
 * @param {*} tag fiber类型
 * @param {*} pendingProps 即将被挂载的属性
 * @param {*} key 
 */
function FiberNode(
  tag: WorkTag, 
  pendingProps, 
  key: null | string
) {

  // Instance
  // 表示当前fiber类型 原生DOM类型(div) | 文本类型 ｜ function | Class
  this.tag = tag;  
  this.key = key
  // 表示当前fiber 节点类型 ‘div’ | 'span' | App
  this.type = null;  
  // 表示当前fiber的实例 真实的document.createElement创建的实例
  this.stateNode = null;  

  // Fiber
  // 表示当前fiber的父fiber
  this.return = null;  
  // 表示当前fiber的子fiber
  this.child = null;   
  // 表示当前fiber的兄弟fiber
  this.sibling = null; 
  this.index = 0;


  // 表示当前fiber传入新的props
  this.pendingProps = pendingProps;  
  // 表示当前fiber的state 比如类组件
  this.memoizedState = null;  
  // 表示当前fiber的props 比如类组件
  this.memoizedProps = null;  

  // 表示当前fiber要进行何种更新
  this.flags = NoFlags;  

  // 连接current fiber 和 workInProgress fiber
  this.alternate = null;  

  // 挂载当前fiber上的新的状态 setState() 链表
  this.updateQueue = null;
}


export const createFiber = function(
  tag: WorkTag, 
  pendingProps, 
  key: null | string
) {
  return new FiberNode(tag, pendingProps, key);
}



export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}



export function createWorkInProgress(current, pendingProps) {

  // ??????
  // render阶段为每个节点创建新的fiber(workInProgress)可能会复用，生成一个新状态的workInProgress树 复用current.alertnate
  // 为什么复用current.alertnate而不是current，因为current已经渲染到页面上了，而current.alertnate还保存在内存中
  // current fiber树代表的是和页面中真是DOM完全一致的fiber树，也就是说current已经完全渲染到页面中了
  let workInProgress = current.alternate;
  if (workInProgress === null) {

    workInProgress = createFiber(
      current.tag, 
      pendingProps, 
      current.key,
    );

    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 双指针 互相指向
    workInProgress.alternate = current;
    current.alternate = workInProgress;

  } else {

    workInProgress.pendingProps = pendingProps;
  }

  // ??????
  // 每次执行setState的时候会创建新的更新，把更新挂载到组件对应的fiber上（当组件执行setState的时候 会先找到组件对应的fiber，将更新放到fiber的updateQueue上）
  // 这个fiber 在奇数更新时存在于current树上，偶数更新时存在于current.alertnate上
  // 由于每次创建或复用workInProgress是从current.alertnate拿对象
  workInProgress.updateQueue = current.updateQueue;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  // console.log('current===', current)
  // console.log('workInProgress===', workInProgress)

  return workInProgress;

}


export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}


export function createFiberFromElement(element) {
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;

  let tag;
  if (typeof type === 'string') {
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;

  return fiber;
}


/**
 * 
 * 当组件执行setState的时候 会先找到组件对应的fiber，将更新放到fiber的updateQueue上
 * 只有当组件初次渲染的时候，会给组件的实例一个属性_reactInternals，而这个属性指向该组件的fiber
 * 
 */