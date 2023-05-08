

/**
 * 初始化更新队列
 * 所有的fiber都会把等待更新的内容 放在更新队列中
 * @param {*} fiber 
 */
export function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: null,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
    },
    effects: null,
  };

  fiber.updateQueue = queue;
}

/**
 * 创建 更新
 * @returns 
 */
export function createUpdate() {
  const update = {

    payload: null,

    next: null,
  };

  return update;
}

/**
 * 给指定fiber添加 更新
 * @param {*} fiber 
 * @param {*} update 
 */
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;

  if (pending === null) {

    // 如果pending没有，则update是第一个更新 环形链表 next 指向自己
    update.next = update;

  } else {

    // 如果有了pending，pending就是最后一个更新

    // 将新的update的next 指向首节点  pending.next是首节点
    update.next = pending.next;
    // 断开之前的指向，更新尾节点
    pending.next = update;

  }

  // 不管有没有pending 最新的更新始终是链表最后的节点
  sharedQueue.pending = update;
}




/**
 * updateQueue 指向的是一个环形链表
 * const updateQueue = {
 *   shared: {
 *     pending: null
 *   }
 * }
 * 
 * 如上 pending 指向的就是该fiber的更新队列 数据结构为环形链表
 * 
 * ---------------
 * |   pending   | --------->---pending永远指向最新的更新------->------
 * |             |                                                 |
 * ---------------                                                 | 
 *                                                                 | =
 *                                                                 |
 *                                                                 |
 * -----------------            -----------------           -----------------
 * |   update1     | ------->   |    update2    | ------->  |    update3    |
 * | {x => x + 1}  |   next     |  {x => x + 2} |   next    |  {x => x + 3} |  
 * -----------------            -----------------           -----------------
 *        |                                                         |
 *        |                           next                          |
 *        | --------<---------<---------<-------<------------<------|
 * 
 * 
 */


