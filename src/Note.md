1、jsx语法
```
<div id='sky' key='fit' title='halo'>
 halo
 <span>world</span>
</div>
```

2、babel 编译jsx语法转化成React.createElement
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

3、React.createElement返回react元素（react element）,$$typeof 属性用来标识对象是react元素
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

4、ReactDOM.render() 
- 创建 root 对象：使用 ReactDOMRoot 创建root对象，root对象包含了fiberRoot
  root 对象如下
  ```
  {
    _internalRoot: {
      containerInfo: null,
      current: null,
      finishedWork: null
    }
  }
  ```
  fiberRoot 对象如下
  ```
  {
    containerInfo: null,
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

