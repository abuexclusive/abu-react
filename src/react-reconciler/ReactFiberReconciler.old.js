
import { createFiberRoot } from "./ReactFiberRoot.old";
import { 
  createUpdate, 
  enqueueUpdate 
} from "./ReactUpdateQueue.old";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop.old";




export function createContainer(container) {
  return createFiberRoot(container);
}


/**
 * 将react元素转化成真是DOM，渲染到容器中
 * @param {*} element react元素
 * @param {*} container fiberRoot 包含container
 */
export function updateContainer(element, container) {
  // console.log('element: ', element);
  // console.log('container: ', container);



  // hostRootFiber 就是 rootFiber，fiber tree的根节点
  // hostRootFiber 对应的DOM节点 就是容器containerInfo div#root
  const current = container.current;

  // 将element作为hostRootFiber的更新添加到updateQueue上
  // 创建一个更新
  const update = createUpdate();

  update.payload = { element };

  // 将更新添加到hostRootFiber的更新队列上 
  enqueueUpdate(current, update);

  // console.log('current: ', current);

  // 在fiber上调度更新
  scheduleUpdateOnFiber(current);

}