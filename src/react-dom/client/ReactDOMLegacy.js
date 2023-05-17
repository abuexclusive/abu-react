/**
 * 旧版ReactDom 由于render方法已被createRoot实例代理，故将旧版render放在这里
 */

import { isValidContainer, createRoot } from './ReactDomRoot';
import { updateContainer } from '../../react-reconciler';


export function render(element, container) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  };

  // console.log('element===', element);

  debugger

  legacyRenderSubtreeIntoContainer(element, container);
}

function legacyRenderSubtreeIntoContainer(children, container) {
  // 第一次 container 是没有 _reactRootContainer，无论渲染多少次 fiberRoot 是同一个 
  let root = container._reactRootContainer;
  let fiberRoot;

  if (!root) {
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container);
    fiberRoot = root._internalRoot;
  } else {
    // TODO
    // ...
    fiberRoot = root._internalRoot;
  }

  // console.log('fiberRoot: ', fiberRoot);

  // 更新容器
  updateContainer(children, fiberRoot);

}


function legacyCreateRootFromDOMContainer(container) {
  // return {
  //   _internalRoot: {
  //     container: div#root,
  //     current: null,
  //     finishedWork: null,
  //   }
  // }
  return createRoot(container);
}

