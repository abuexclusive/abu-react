一、vnode
```
{
  type: 'div',
  key: null,
  ref: null,
  props: {
    id: 'root',
    children: [
      {
        type: 'div',
        key: null,
        ref: null,
        props: {
          id: 'app',
          children: 'hello react'
        }
      }
    ]
  }
}
```


二、fiber
```
{
  statenode,
  child,
  sibling,
  return,
}
```
fiber特性
- 增量渲染：将任务拆分，均匀到每一帧里面去执行
- 暂停、终止、复用渲染任务
- 任务优先级：高优先级先执行 低优先级后执行，还可以任务插队


三、react fiber运行流程
1. react执行某一个任务，请求调度跟浏览器说有一个任务需要执行
2. 浏览器在执行完 事件处理、js执行、布局/绘制，如果有空闲时间将控制权交给react执行任务，其中fiber就是任务单元
3. 执行任务单元，执行完毕查看是否还有空闲时间，还有时间就执行下一个任务单元
4. 没有时间就将控制权交还给浏览器


四、帧
大多数设备屏幕的刷新频率为60次/秒，就是60帧每秒，所以每帧的预算时间就是16.66毫秒，帧数（fps）越高，页面显示的就越流畅，小于60帧，用户就会感觉到卡顿。
每帧开头包括：样式计算、布局和绘制。js引擎线程和页面渲染线程两者是互斥的（因为js会操作dom元素，进而会影响GUI线程渲染的结果，因为两者是互斥的），如果某个任务执行时间过长，浏览器就会推迟渲染。

<kbd>input event handlers</kbd> -> <kbd>requestAnimationFrame</kbd> -> <kbd>Parse HTML</kbd> -> <kbd>Parse styles</kbd> -> <kbd>layout</kbd> -> <kbd>Paint</kbd> -> <kbd>requestIdleCallback</kbd>




五、window.requestAnimationFrame
要求浏览器在下次重绘之前调用指定的回调函数更新动画，该方法传入一个回调函数，该回调函数会在浏览器下次重绘之前执行。按照一般浏览器刷新频率来算,传入的回调函数每秒会执行60次，示例：animation.html
🔥🔥🔥 如果想让浏览器在每次重绘之前都调用callback，必须在callback中再次调用requestAnimationFrame
```
window.requestAnimationFrame(callback)
```


六、window.requestIdleCallback
插入一个函数，这个函数将在浏览器空闲时期被调用，示例：idlecallback.html


七、fiber的执行阶段
<!-- 每次渲染都有两个阶段：Reconciliation（协调阶段）、commit（提交阶段）

Reconciliation：可以认为是Diff阶段，这个阶段可以被终止，这个阶段会找出所有节点变更，例如节点新增、删除、属性变更等等，这些变更react称之为副作用。
commit：将上个阶段计算出来的需要处理的副作用（effects）一次性执行，这个阶段必须被同步执行，不能被打断。 -->


八、react合成事件