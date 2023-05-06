
import { createFiberRoot } from "./ReactFiberRoot.old";

export function createContainer(container) {
  return createFiberRoot(container);
}