/**
 * 旧版ReactDom 由于render方法已被createRoot实例代理，故将旧版render放在这里
 */

import { isValidContainer } from './ReactDomRoot';

export function render(element, container) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  };
  legacyRenderSubtreeIntoContainer(element, container);
}

function legacyRenderSubtreeIntoContainer(element, container) {
  console.log(element, container);
}