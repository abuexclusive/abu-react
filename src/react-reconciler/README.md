#### react创建的root 
root包含两个属性current、workInProgress
- current 指向当前的fiber树，初始化的时候react会创建一个uninitializedFiber代替current fiber树的rootFiber，初次渲染时current fiber树其实只有一个rootFiber
- workInProgress 指向即将渲染的fiber树，初次渲染时workInProgress fiber树其实也就只有一个rootFiber，但是会根据这个rootFiber创建workInProgress fiber树

#### 副作用链表
子fiber的副作用排在父fiber父作用的前面

- 为了避免遍历fiber树寻找有副作用的fiber节点，所以就有的 effectList

- 在fiber树构建的构建过程中，每当一个fiber节点的flags字段不为 NoFlags时，fiber节点添加至 effect list中
- effectList 是一个单向链表，firstEffect 代表链表中的第一个fiber节点，lastEffect 代表链表中的最后一个节点
- fiber树的构建是深度优先的，也就是先向下构建子级fiber节点，子级fiber节点构建完成后，再向上构建父级fiber节点，所以在effectList中总是子级fiber节点在前面
- fiber节点构建完成的操作执行在 completeUnitOfWork 方法中，在这个方法中不仅对节点完成构建，也会将有 flags的fiber节点添加到effectList中

<img src="/Users/luoyongbo/Desktop/alibaba/abu-react/src/react-reconciler/READEFFECT1.jpg" alt="READEFFECT"/>

