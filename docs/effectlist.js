const Placement = '添加';

const rootFiber = { key: 'rootFiber' };
const fiberA = { key: 'A', flags: '添加' };
const fiberB = { key: 'B', flags: '添加' };
const fiberC = { key: 'C', flags: '添加' };

// rootFiber -> A -> BC
// 先是B完成
// 首先完成的fiber节点 把自己的副作用上交给父fiber，一级一级不断的上交
function collectEffectList(returnFiber, completedWork) {

  // 如果父亲没有effectlist，那就让父亲的firstEffect链表头指向自己的头
  if (!returnFiber.firstEffect) {
    returnFiber.firstEffect = completedWork.firstEffect;
  }

  // 如果自己有链表
  if (completedWork.lastEffect) {
    // 并且父亲也有链表尾
    if (returnFiber.lastEffect) {
      // 把自己身上的effectlist挂到父亲链表的尾部
      returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
    }
    returnFiber.lastEffect = completedWork.lastEffect
  }

  const flags = completedWork.flags;
  if (flags) {
    // 说明是有副作用的
    // 上交自己的副作用

    if (returnFiber.lastEffect) {
      // 说明父fiber已经有effectlist
      returnFiber.lastEffect.nextEffect = completedWork;
    } else {
      returnFiber.firstEffect = completedWork;
    }
    
    // 新上交的副作用 肯定是effectlist链表的最后一个
    returnFiber.lastEffect = completedWork;
  }
}

// 先fiberB完成
collectEffectList(fiberA, fiberB);
// 然后是fiberC完成
collectEffectList(fiberA, fiberC);
// 然后是fiberA完成
collectEffectList(rootFiber, fiberA);

console.log(rootFiber);


let effectList = '';
let nextEffect = rootFiber.firstEffect;
while (nextEffect) {
  effectList += `${nextEffect.key} =>`;
  nextEffect = nextEffect.nextEffect;
}
effectList += `null`;

console.log(effectList);

