const Placement = '添加';

const rootFiber = { key: 'rootFiber' };
const fiberA = { key: 'A', flags: Placement };
const fiberB = { key: 'B', flags: Placement };
const fiberC = { key: 'C', flags: Placement };
const fiberB1 = { key: 'B1', flags: Placement };
const fiberB2 = { key: 'B2', flags: Placement };
const fiberC1 = { key: 'C1', flags: Placement };
const fiberC2 = { key: 'C2', flags: Placement };

// rootFiber -> A -> B(B1、B2)  C(C1、C2)
// 先是B完成
// 首先完成的fiber节点 把自己的副作用上交给父fiber，一级一级不断的上交
function collectEffectList(returnFiber, completedWork) {

  // 如果父亲没有effectlist，那就让父亲的firstEffect链表头指向自己的头
  if (!returnFiber.firstEffect) {
    returnFiber.firstEffect = completedWork.firstEffect;
  }

  // 如果自己有链表 当自己结束并且有effectlist时，先把自己的effectlist交给returnFiber，然后再把自己追加到后面
  if (completedWork.lastEffect) {
    // 并且父亲也有链表尾
    if (returnFiber.lastEffect) {
      // 把自己身上的effectlist挂到父亲链表的尾部
      returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
    }
    returnFiber.lastEffect = completedWork.lastEffect
  }


  // 只是把自己交给父fiber的effectlist
  const flags = completedWork.flags;
  if (flags) {
    // 说明是有副作用的
    // 上交自己的副作用

    if (returnFiber.lastEffect) {
      // 说明父fiber已经有effectlist
      // C 完成时 A已经有effectlist，这是应该把C挂到A的effectlist后面去
      returnFiber.lastEffect.nextEffect = completedWork;
    } else {
      // B 先完成走这里，这是A的firstEffect = completedWork， lastEffect = completedWork
      returnFiber.firstEffect = completedWork;
    }
    
    // 新上交的副作用 肯定是effectlist链表的最后一个
    returnFiber.lastEffect = completedWork;
  }
}

// 先fiberB1完成
collectEffectList(fiberB, fiberB1);
// 然后是fiberB2完成
collectEffectList(fiberB, fiberB2);
// 然后是fiberB完成
collectEffectList(fiberA, fiberB);
// 然后是fiberC1完成
collectEffectList(fiberC, fiberC1);
// 然后是fiberC2完成
collectEffectList(fiberC, fiberC2);
// 然后是fiberC完成
collectEffectList(fiberA, fiberC);
// 然后是fiberA完成
collectEffectList(rootFiber, fiberA);

// console.log(rootFiber);


let effectList = '';
let nextEffect = rootFiber.firstEffect;
while (nextEffect) {
  effectList += `${nextEffect.key} =>`;
  nextEffect = nextEffect.nextEffect;
}
effectList += `null`;

console.log(effectList);

