/**
 * 旧版ReactDom 由于render方法已被createRoot实例代理，故将旧版render放在这里
 */

import { isValidContainer, createRoot } from './ReactDomRoot';

export function render(element, container) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  };

  // console.log('element===', element);
  // console.log('container===', container);

  legacyRenderSubtreeIntoContainer(element, container);
}

function legacyRenderSubtreeIntoContainer(children, container) {
  let root = container._reactRootContainer;
  let fiberRoot;

  if (!root) {
    root = legacyCreateRootFromDOMContainer(container);
    fiberRoot = root._internalRoot;
  }
  console.log('root: ', root);
  console.log('fiberRoot: ', fiberRoot);
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

