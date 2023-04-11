一、react事件流
```
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
    };
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  

  componentDidMount() {

    // addEventListener true 捕获 false 冒泡
    document.addEventListener('click', () => {
      console.log('document原生事件捕获');
    }, true);

    document.addEventListener('click', () => {
      console.log('document原生事件冒泡');
    }, false);

    this.parentRef.current.addEventListener('click', () => {
      console.log('父元素原生事件捕获');
    }, true);

    this.parentRef.current.addEventListener('click', () => {
      console.log('父元素原生事件冒泡');
    }, false);

    this.childRef.current.addEventListener('click', () => {
      console.log('子元素原生事件捕获');
    }, true);

    this.childRef.current.addEventListener('click', () => {
      console.log('子元素原生事件冒泡');
    }, false);

  }

  parentBubble = () => {
    console.log('父元素React事件冒泡');
  }

  parentCapture = () => {
    console.log('父元素React事件捕获');
  }

  childBubble = () => {
    console.log('子元素React事件冒泡');
  }

  childCapture = () => {
    console.log('子元素React事件捕获');
  }


  render() {
    return (
      <div ref={this.parentRef} onClick={this.parentBubble} onClickCapture={this.parentCapture}>
        <p ref={this.childRef} onClick={this.childBubble} onClickCapture={this.childCapture}>
          点击
        </p>
        <ul>
          {
            this.state.events.map(event => <li>{event}</li>)
          }
        </ul>
      </div>
    );
  }
}
```
```
document原生事件捕获
父元素React事件捕获
子元素React事件捕获
父元素原生事件捕获
子元素原生事件捕获
子元素原生事件冒泡
父元素原生事件冒泡
子元素React事件冒泡
父元素React事件冒泡
document原生事件冒泡
```
原理：react事件是将事件代理（事件委托）到了容器root上（17以前是委托到文档对象document，17以后是委托给容器root），并不是绑定给真正的DOM元素。先触发document的原生捕获，父元素挂载了两个捕获事件，先走react捕获，后走原生捕获，因为react启动就会立马把react事件注册，而原生事件要在componentDidMount中才注册。

17前后区别
- react16时事件委托的对象是document，react17时事件委托的对象是容器组件
- react16时原生事件与react事件执行时，冒泡阶段与捕获阶段没有区分开（捕获-> 冒泡 -> 捕获）；react17时优化了合成事件的执行，当与原生事件一起调用时，捕获阶段总是先于冒泡阶段（捕获 -> 冒泡）
- react17废弃了事件池