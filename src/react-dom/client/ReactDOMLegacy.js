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

  const root = createRoot(container);
  root.render(element, container);



}

