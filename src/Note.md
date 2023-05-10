#### jsx语法
```
<div id='sky' key='fit' title='halo'>
 halo
 <span>world</span>
</div>
```

#### babel 编译jsx
jsx语法转化成React.createElement
```
React.createElement(
  'div',
  {
    id: 'sky',
    key: 'fit',
    title: 'halo'
  },
  'halo',
  React.createElement(
    'span',
    null,
    'world'
  )
);
```

#### react.createElement
编辑成React.createElement 该方法返回react元素（react element）,$$typeof 属性用来标识对象是react元素
```
{
  $$typeof: Symbol(react.element)
  type: 'div',
  key: 'fit',
  props: {
    id: 'sky',
    children: [
      'halo',
      {
        $$typeof: Symbol(react.element)
        type: span,
        props: {
          children: 'world'
        }
      }
    ],
  }
}
```

#### ReactDOM.render() 
创建 root 对象：使用 ReactDOMRoot 创建 root 对象，root 对象包含了 fiberRoot

root 对象如下
```
{
  _internalRoot: {
    containerInfo: div#root,
    current: null,
    finishedWork: null
  }
}
```
fiberRoot 对象如下
```
{
  containerInfo: div#root,
  current: null,
  finishedWork: null
}
```
调用栈如下
方法名                                   | 类名
---                                     | ---
render                                  | ReactDOMLegacy
legacyRenderSubtreeIntoContainer        | ReactDOMLegacy
legacyCreateRootFromDOMContainer        | ReactDOMLegacy
createRoot                              | ReactDomRoot
ReactDOMRoot Constructor                | ReactDomRoot
createRootImpl                          | ReactDomRoot
createContainer                         | ReactFiberReconciler.old
createFiberRoot                         | ReactFiberRoot.old
FiberRootNode Constructor               | ReactFiberRoot.old
initializeUpdateQueue                   | ReactUpdateQueue.old

这里第一次渲染的 创建了一个 uninitializedFiber，并将 fiberRoot 的 current 指向 uninitializedFiber 用来代替 current fiber tree，uninitializedFiber 其实就是 HostRootFiber，并为这第一个 fiber 初始化了 updateQueue

#### updateContainer 更新容器 
有了firberRoot之后，需要将react element（react元素）转化成真是DOM 渲染到container容器中，此时就将react element 作为一个update，添加到 current tree的rootfiber的updateQueue中，然后在fiber上调度更新。
调用栈如下
方法名                                     | 类名
---                                       | ---
updateContainer                           | ReactFiberReconciler.old
createUpdate                              | ReactUpdateQueue.old
enqueueUpdate                             | ReactUpdateQueue.old
scheduleUpdateOnFiber                     | ReactFiberWorkLoop.old
markUpdateLaneFromFiberToRoot             | ReactFiberWorkLoop.old
performSyncWorkOnRoot                     | ReactFiberWorkLoop.old

此时第一次渲染curent fiber tree就一个hostRootFiber，接下来需要根据current fiber来创建 workInprogress fiber

                    ---------------------------
                    |     FiberRootNode       |
                    | containerInfo(div#root) |
                    ---------------------------
                          ^            |
                          |            |current
                          |stateNode   |
                          |            V
                    ------------------------      alternate      ------------------------
                    |     hostRootFiber    |     ---------->     |    workInprogress    |
                    | updateQueue(element) |     <----------     | updateQueue(element) |
                    ------------------------      alternate      ------------------------


#### workLoopSync 开启循环
从 workInprogress tree 的 hostRootFiber 的 updateQueue 中获取 element，然后根据 element 创建 workInprogress tree，第一个任务单元是 workInprogress tree 的 hostRootFiber，开始执行任务单元时，beginWork 专门负责返回当前任务单元（fiber）的 child fiber。
调用栈如下
方法名                                     | 类名
---                                       | ---
workLoopSync                              | ReactFiberWorkLoop.old
performUnitOfWork                         | ReactFiberWorkLoop.old









